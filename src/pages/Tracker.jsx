import React, { useState, useEffect, useMemo, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import html2canvas from 'html2canvas';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup, onAuthStateChanged, signOut, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const API_URL = "https://script.google.com/macros/s/AKfycbz-CzGcMTcsIBX_4XBm3BMaBoNPHI02YNt3bhXHEhnNwNII7JXR7OYF3fKr7z9sVUpfcw/exec";
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const ratingOptions = [
    "Bronze 1", "Bronze 2", "Bronze 3",
    "Silver 1", "Silver 2", "Silver 3",
    "Gold 1", "Gold 2", "Gold 3",
    "Platinum 1", "Platinum 2", "Platinum 3"
];

const ratingToValue = ratingOptions.reduce((acc, curr, index) => {
    acc[curr] = index + 1;
    return acc;
}, {});

const valueToRating = ratingOptions.reduce((acc, curr, index) => {
    acc[index + 1] = curr;
    return acc;
}, {});

const parseRankString = (rankStr) => {
    if (!rankStr) return { rankName: "Bronze 1", progress: 0 };
    const match = rankStr.toString().match(/(.*?)(?:\s*\((\d+)%\))?$/);
    if (match) {
        return {
            rankName: match[1].trim(),
            progress: match[2] ? parseInt(match[2], 10) : 0
        };
    }
    return { rankName: rankStr.trim(), progress: 0 };
};

const getRankColor = (rankName) => {
    if (rankName.includes("Bronze")) return "#cd7f32";
    if (rankName.includes("Silver")) return "#c0c0c0";
    if (rankName.includes("Gold")) return "#ffd700";
    if (rankName.includes("Platinum")) return "#00d2ff"; // プラチナ
    return "#555";
};

const Tracker = () => {
    // 認証ステート
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    
    // メールアドレス認証用ステート
    const [loginMode, setLoginMode] = useState('select'); // 'select', 'email_login', 'email_signup'
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [authError, setAuthError] = useState('');
    
    // アカウントに紐づくドライバー名
    const [myDriverName, setMyDriverName] = useState('');
    const [tempDriverName, setTempDriverName] = useState('');

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [ocrLoading, setOcrLoading] = useState(false);
    const [formData, setFormData] = useState({
        dr: 'Bronze 1',
        drProgress: 0,
        sr: 'Bronze 1',
        srProgress: 0
    });
    
    // プロフィールカード用のステート
    const [profile, setProfile] = useState({
        driverTitle: '',
        favClass: 'Hypercar',
        favCar: '',
        equipment: '',
        playTime: '',
        comment: '',
        avatarImage: '',
        carImage: ''
    });
    
    const chartRef = useRef(null);
    const cardRef = useRef(null); // カード用のRefを追加

    // 認証状態の監視
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setAuthLoading(false);
            if (currentUser) {
                // ローカルから保存済みのドライバー名を取得
                const savedName = localStorage.getItem(`driverName_${currentUser.uid}`);
                if (savedName) {
                    setMyDriverName(savedName);
                }
                const savedProfile = localStorage.getItem(`profile_${currentUser.uid}`);
                if (savedProfile) {
                    setProfile(JSON.parse(savedProfile));
                }
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (user && myDriverName) {
            fetchHistory();
        }
    }, [user, myDriverName]);

    const handleLogin = async () => {
        setAuthError('');
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError("Googleログインに失敗しました。設定を確認してください。");
        }
    };

    const handleEmailSignup = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            await createUserWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Signup failed:", error);
            setAuthError(error.message.includes('email-already-in-use') 
                ? 'このメールアドレスは既に登録されています。' 
                : '登録に失敗しました: ' + error.message);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
        } catch (error) {
            console.error("Login failed:", error);
            setAuthError('メールアドレスまたはパスワードが間違っています。');
        }
    };

    const handleLogout = async () => {
        if (window.confirm("ログアウトしますか？")) {
            await signOut(auth);
            setMyDriverName('');
            setHistory([]);
            setLoginMode('select');
        }
    };

    const handleSaveDriverName = (e) => {
        e.preventDefault();
        if (!tempDriverName.trim()) return;
        // UIDごとにドライバー名をローカル保存
        localStorage.setItem(`driverName_${user.uid}`, tempDriverName.trim());
        setMyDriverName(tempDriverName.trim());
    };

    const fetchHistory = async () => {
        try {
            setLoading(true);
            const response = await fetch(API_URL);
            const data = await response.json();
            
            // 自分のデータだけを抽出し、タイムスタンプで降順（新しい順）にソートする
            const myData = data
                .filter(item => item.driverName === myDriverName)
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                
            setHistory(myData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!myDriverName) return alert("ドライバー名が設定されていません");
        
        try {
            setSubmitting(true);
            
            const payload = {
                driverName: myDriverName,
                dr: `${formData.dr} (${formData.drProgress || 0}%)`,
                sr: `${formData.sr} (${formData.srProgress || 0}%)`
            };

            await fetch(API_URL, {
                method: 'POST',
                body: JSON.stringify(payload),
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'text/plain',
                }
            });
            
            setFormData({ dr: 'Bronze 1', drProgress: 0, sr: 'Bronze 1', srProgress: 0 });
            
            setTimeout(() => {
                fetchHistory();
                setSubmitting(false);
            }, 1000);
            
        } catch (error) {
            console.error("Error submitting data:", error);
            alert("送信に失敗しました");
            setSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'drProgress' || name === 'srProgress') {
            const num = Math.min(100, Math.max(0, parseInt(value || 0, 10)));
            setFormData({ ...formData, [name]: num });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleProfileChange = (e) => {
        const newProfile = { ...profile, [e.target.name]: e.target.value };
        setProfile(newProfile);
        localStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
    };

    const handleProfileImageUpload = (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // アバターは小さめ、車画像は大きめにリサイズ
                const MAX_WIDTH = fieldName === 'avatarImage' ? 300 : 800;
                const MAX_HEIGHT = fieldName === 'avatarImage' ? 300 : 600;
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width;
                        width = MAX_WIDTH;
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height;
                        height = MAX_HEIGHT;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
                const dataUrl = canvas.toDataURL('image/jpeg', 0.85); // 圧縮率0.85
                
                const newProfile = { ...profile, [fieldName]: dataUrl };
                setProfile(newProfile);
                localStorage.setItem(`profile_${user.uid}`, JSON.stringify(newProfile));
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setOcrLoading(true);
        try {
            const base64Image = await new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
                    resolve(base64String);
                };
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const prompt = `
You are an expert reading Le Mans Ultimate post-race screenshots.
Extract the driver name, Driver Rank, Safety Rank, and estimate the visual percentage of their progress bars.
Rules:
- The driver name is usually below the car image next to a flag (e.g., KENTA CICCIDA). Ensure correct casing.
- Driver Rank and Safety Rank must be formatted strictly as 'Color Number' (e.g., 'Bronze 1', 'Silver 2', 'Platinum 3', 'Gold 1').
- For 'drProgress' and 'srProgress', look at the horizontal progress bar under the large rank number box. 
- The filled portion of the bar is ALWAYS a SOLID WHITE LINE. The empty portion is represented by faint dashes or gaps.
- Estimate the width of ONLY the SOLID WHITE LINE relative to the total width of the bar (0 to 100).
- Provide your honest mathematical estimate as an integer based on the pixels.
- Return ONLY a valid JSON object in the exact format below, without any markdown blocks or extra text:
{"driverName": "Name", "dr": "Rank", "drProgress": 0, "sr": "Rank", "srProgress": 0}
(Replace the 0s with your estimated integer).
`;

            let attempt = 0;
            const maxAttempts = 3;
            let success = false;
            let parsedData = null;

            while (attempt < maxAttempts && !success) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                parts: [
                                    { text: prompt },
                                    {
                                        inline_data: {
                                            mime_type: file.type || 'image/jpeg',
                                            data: base64Image
                                        }
                                    }
                                ]
                            }]
                        })
                    });

                    if (response.status === 429) {
                        console.warn('AI Rate limit hit. Retrying...');
                        attempt++;
                        await new Promise(res => setTimeout(res, 2500 * attempt));
                        continue;
                    }

                    const json = await response.json();
                    if (json.error) throw new Error(json.error.message);

                    const text = json.candidates[0].content.parts[0].text;
                    const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
                    parsedData = JSON.parse(cleanText);
                    success = true;

                } catch (err) {
                    console.error("Gemini API Error:", err);
                    attempt++;
                    if (attempt >= maxAttempts) throw err;
                    await new Promise(res => setTimeout(res, 2500 * attempt));
                }
            }

            if (parsedData) {
                if (parsedData.driverName && parsedData.driverName.toUpperCase() !== myDriverName.toUpperCase()) {
                    alert(`警告: 読み取った名前（${parsedData.driverName}）が設定名（${myDriverName}）と異なります。\n\n他人のリザルト画像を間違って読み込んでいないか確認してください。`);
                }
                
                setFormData(prev => ({
                    ...prev,
                    dr: ratingOptions.includes(parsedData.dr) ? parsedData.dr : prev.dr,
                    drProgress: parsedData.drProgress || 0,
                    sr: ratingOptions.includes(parsedData.sr) ? parsedData.sr : prev.sr,
                    srProgress: parsedData.srProgress || 0
                }));
            } else {
                alert("画像の解析に失敗しました。");
            }

        } catch (error) {
            console.error("Image upload failed:", error);
            alert("画像読み取り中にエラーが発生しました。");
        } finally {
            setOcrLoading(false);
            e.target.value = null;
        }
    };

    const handleDownloadImage = async (targetRef, fileNamePrefix) => {
        if (!targetRef.current) return;
        try {
            const watermark = targetRef.current.querySelector('.chart-watermark');
            if (watermark) watermark.style.display = 'block';

            const canvas = await html2canvas(targetRef.current, {
                backgroundColor: '#111',
                scale: 2
            });

            if (watermark) watermark.style.display = 'none';

            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            const file = new File([blob], `WECSS_${fileNamePrefix}_${myDriverName}.png`, { type: 'image/png' });
            
            const shareText = fileNamePrefix === 'Card' 
                ? `${myDriverName} のプロフィールカード！\n#WECSS #LeMansUltimate`
                : `${myDriverName} の最新レーティング推移！\n#WECSS #LeMansUltimate`;

            // スマホかどうかを判定
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

            // スマホの場合のみ、ネイティブのシェア機能（画像添付可能）を使う
            if (isMobile && navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        files: [file],
                        title: `WECSS ${fileNamePrefix}`,
                        text: shareText
                    });
                    return;
                } catch (shareError) {
                    console.log("シェアがキャンセルされました", shareError);
                    return;
                }
            }

            // PCの場合（またはシェア機能非対応の場合）はダウンロード＆Twitter誘導
            const link = document.createElement('a');
            link.download = file.name;
            link.href = URL.createObjectURL(blob);
            link.click();
            
            if (window.confirm(`画像を「${file.name}」としてダウンロードしました！\n\nPCブラウザからは画像を自動添付できないため、この後開くX(Twitter)の画面に、ダウンロードした画像をドラッグ＆ドロップしてください。\n\n今すぐXの投稿画面を開きますか？`)) {
                const newTab = window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank');
                if (!newTab || newTab.closed || typeof newTab.closed === 'undefined') {
                    // ポップアップブロックされた場合は、現在のタブをそのままXに遷移させる
                    window.location.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
                }
            }

        } catch (err) {
            console.error("Image generation failed", err);
            alert("画像の生成に失敗しました。");
        }
    };

    const chartData = useMemo(() => {
        if (!myDriverName) return [];
        
        const sortedDriverData = [...history].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        return sortedDriverData.map(item => {
                const dateObj = new Date(item.timestamp);
                const dateStr = !isNaN(dateObj.getTime()) 
                    ? `${(dateObj.getMonth()+1)}/${dateObj.getDate()}`
                    : '';
                
                const parsedDr = parseRankString(item.dr);
                const parsedSr = parseRankString(item.sr);

                const drBaseValue = ratingToValue[parsedDr.rankName] || 0;
                const srBaseValue = ratingToValue[parsedSr.rankName] || 0;

                return {
                    date: dateStr,
                    rawTimestamp: item.timestamp,
                    drValue: drBaseValue === 0 ? 0 : drBaseValue + (parsedDr.progress / 100),
                    srValue: srBaseValue === 0 ? 0 : srBaseValue + (parsedSr.progress / 100),
                    drName: item.dr,
                    srName: item.sr
                };
            });
    }, [history, myDriverName]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length >= 2) {
            return (
                <div style={{ background: 'rgba(0,0,0,0.9)', border: '1px solid rgba(255,255,255,0.2)', padding: '10px 15px', borderRadius: '5px' }}>
                    <p style={{ color: '#fff', marginBottom: '8px', fontSize: '0.9rem' }}>{label}</p>
                    <p style={{ color: '#ff003c', fontWeight: 'bold', margin: '3px 0' }}>DR: {payload[0].payload.drName}</p>
                    <p style={{ color: '#00d2ff', fontWeight: 'bold', margin: '3px 0' }}>SR: {payload[1].payload.srName}</p>
                </div>
            );
        }
        return null;
    };

    const formatYAxis = (tickItem) => {
        const baseInt = Math.floor(tickItem);
        return valueToRating[baseInt] || '';
    };

    // 最新のデータを取得してカード用に整形
    const latestEntry = history.length > 0 ? history[0] : null;
    const currentDr = latestEntry ? parseRankString(latestEntry.dr) : { rankName: 'Bronze 1', progress: 0 };
    const currentSr = latestEntry ? parseRankString(latestEntry.sr) : { rankName: 'Bronze 1', progress: 0 };
    const drColor = getRankColor(currentDr.rankName);
    const srColor = getRankColor(currentSr.rankName);

    if (authLoading) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0a0a0a', color: '#fff' }}>
                <p>Loading Tracker...</p>
            </div>
        );
    }

    // ログイン画面
    if (!user) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                color: '#fff', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url("/assets/hero-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ background: 'rgba(20,20,20,0.8)', padding: '40px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(0,210,255,0.3)', backdropFilter: 'blur(5px)', maxWidth: '400px', width: '90%' }}>
                    <h1 style={{ fontSize: '2rem', color: '#00d2ff', marginBottom: '10px', textTransform: 'uppercase' }}>DR/SR Tracker</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '30px', fontSize: '0.9rem' }}>トラッカーを利用するにはログインしてください。</p>
                    
                    {authError && <p style={{ color: '#ff003c', fontSize: '0.8rem', marginBottom: '15px', background: 'rgba(255,0,0,0.1)', padding: '10px', borderRadius: '5px' }}>{authError}</p>}

                    {loginMode === 'select' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <button 
                                onClick={handleLogin}
                                style={{ 
                                    width: '100%', padding: '15px', background: '#fff', color: '#333', 
                                    border: 'none', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem',
                                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                                    boxShadow: '0 5px 15px rgba(255,255,255,0.2)'
                                }}
                            >
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }}/>
                                Googleでログイン
                            </button>
                            
                            <div style={{ display: 'flex', alignItems: 'center', margin: '10px 0' }}>
                                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                                <span style={{ padding: '0 10px', color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>または</span>
                                <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)' }} />
                            </div>

                            <button 
                                onClick={() => setLoginMode('email_login')}
                                style={{ 
                                    width: '100%', padding: '15px', background: 'rgba(0,210,255,0.1)', color: '#00d2ff', 
                                    border: '1px solid #00d2ff', borderRadius: '50px', fontWeight: 'bold', fontSize: '1rem',
                                    cursor: 'pointer'
                                }}
                            >
                                メールアドレスでログイン
                            </button>
                            
                            <p style={{ marginTop: '10px', fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>
                                アカウントをお持ちでない方は<span onClick={() => setLoginMode('email_signup')} style={{ color: '#00d2ff', cursor: 'pointer', textDecoration: 'underline' }}>新規登録</span>
                            </p>
                        </div>
                    )}

                    {loginMode === 'email_login' && (
                        <form onSubmit={handleEmailLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                type="email" placeholder="メールアドレス" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                            />
                            <input 
                                type="password" placeholder="パスワード (6文字以上)" required
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                            />
                            <button type="submit" style={{ width: '100%', padding: '15px', background: '#00d2ff', color: '#000', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
                                ログイン
                            </button>
                            <p onClick={() => setLoginMode('select')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px' }}>戻る</p>
                        </form>
                    )}

                    {loginMode === 'email_signup' && (
                        <form onSubmit={handleEmailSignup} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input 
                                type="email" placeholder="登録するメールアドレス" required
                                value={email} onChange={(e) => setEmail(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                            />
                            <input 
                                type="password" placeholder="パスワードを設定 (6文字以上)" required minLength={6}
                                value={password} onChange={(e) => setPassword(e.target.value)}
                                style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                            />
                            <button type="submit" style={{ width: '100%', padding: '15px', background: '#ff003c', color: '#fff', border: 'none', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer' }}>
                                新規登録して開始
                            </button>
                            <p onClick={() => setLoginMode('select')} style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', cursor: 'pointer', marginTop: '10px' }}>戻る</p>
                        </form>
                    )}

                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginTop: '30px' }}>※あなたの専用データを保護するためにのみ使用されます</p>
                </div>
            </div>
        );
    }

    if (!myDriverName) {
        return (
            <div style={{ 
                minHeight: '100vh', 
                color: '#fff', 
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundImage: 'linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url("/assets/hero-bg.png")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}>
                <div style={{ background: 'rgba(20,20,20,0.8)', padding: '40px', borderRadius: '15px', textAlign: 'center', border: '1px solid rgba(0,210,255,0.3)', backdropFilter: 'blur(5px)', maxWidth: '500px', width: '90%' }}>
                    <h2 style={{ fontSize: '1.5rem', color: '#00d2ff', marginBottom: '20px' }}>初期設定：プレイヤー名の登録</h2>
                    <p style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '20px', fontSize: '0.9rem', lineHeight: '1.5' }}>
                        記録を紐付けるための**ゲーム内のプレイヤー名（Driver Name）**を入力してください。<br/>
                        <span style={{ color: '#ffb700' }}>※一度設定すると、この名前のデータのみがあなたのグラフに表示されるようになります。</span>
                    </p>
                    
                    <form onSubmit={handleSaveDriverName}>
                        <input 
                            type="text" 
                            value={tempDriverName}
                            onChange={(e) => setTempDriverName(e.target.value)}
                            placeholder="例: WECSS_DRIVER_01"
                            style={{ width: '100%', padding: '15px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px', marginBottom: '20px', textAlign: 'center', fontSize: '1.1rem' }}
                        />
                        <button 
                            type="submit"
                            style={{ 
                                width: '100%', padding: '15px', background: 'linear-gradient(90deg, #00d2ff, #0088ff)', 
                                color: '#fff', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
                            }}
                        >
                            この名前で設定する
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div style={{ 
            minHeight: '100vh', 
            color: '#fff', 
            padding: '100px 15px 50px 15px',
            backgroundImage: 'linear-gradient(rgba(10,10,10,0.85), rgba(10,10,10,0.95)), url("/assets/hero-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
        }}>
            <div className="container" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <img src={user.photoURL || '/assets/logo.png'} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #00d2ff', objectFit: 'cover' }} />
                        <div>
                            <p style={{ margin: 0, fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }}>ログイン中</p>
                            <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{user.displayName || user.email}</p>
                        </div>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}>
                        ログアウト
                    </button>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: '900', color: '#00d2ff', textTransform: 'uppercase', letterSpacing: '2px' }}>DR/SR Tracker</h1>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem' }}>自分専用のレーティング推移</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', marginBottom: '40px' }} className="tracker-top-grid">
                    
                    <div style={{ 
                        background: 'rgba(20,20,20,0.8)', 
                        padding: '25px', 
                        borderRadius: '15px', 
                        border: '1px solid rgba(0,210,255,0.3)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(5px)',
                        height: 'fit-content'
                    }}>
                        <h2 style={{ fontSize: '1.3rem', color: '#00d2ff', marginBottom: '20px', fontWeight: 'bold' }}>UPDATE RATING</h2>
                        
                        <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(0,210,255,0.1)', border: '1px dashed #00d2ff', borderRadius: '10px', textAlign: 'center' }}>
                            <p style={{ color: '#00d2ff', fontSize: '0.9rem', marginBottom: '10px', fontWeight: 'bold' }}>📸 スクショで自動入力 (AI OCR)</p>
                            <label style={{ 
                                display: 'inline-block', padding: '10px 20px', background: ocrLoading ? '#555' : '#00d2ff', 
                                color: ocrLoading ? '#fff' : '#000', borderRadius: '30px', cursor: ocrLoading ? 'not-allowed' : 'pointer', 
                                fontWeight: 'bold', fontSize: '0.9rem', transition: '0.3s'
                            }}>
                                {ocrLoading ? 'AIが解析中...お待ちください' : '画像を選択する'}
                                <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={ocrLoading} />
                            </label>
                            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginTop: '10px' }}>Rank Breakdownの画面をアップロードしてください</p>
                            <p style={{ color: '#ffb700', fontSize: '0.7rem', marginTop: '5px', lineHeight: '1.4' }}>※ゲージ量(%)の推測はブレる場合があります。<br/>読み込み後、ご自身の目で正しい数値に修正して保存してください。</p>
                        </div>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div>
                                <label style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                                    Driver Name
                                    <span 
                                        onClick={() => {
                                            if(window.confirm('ドライバー名を変更しますか？\n※過去の記録と名前が一致しなくなるため、Tracker上では新しいドライバーとして集計されます。')) {
                                                localStorage.removeItem(`driverName_${user.uid}`);
                                                setMyDriverName('');
                                            }
                                        }}
                                        style={{ fontSize: '0.7rem', color: '#00d2ff', marginLeft: '15px', cursor: 'pointer', borderBottom: '1px solid #00d2ff' }}
                                    >
                                        変更する
                                    </span>
                                </label>
                                <input 
                                    type="text" 
                                    value={myDriverName}
                                    disabled
                                    style={{ width: '100%', padding: '12px', background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: '5px', cursor: 'not-allowed' }}
                                />
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.7rem', color: '#00d2ff' }}>※このアカウントに紐付けられています</p>
                            </div>
                            
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Driver Rank (DR)</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <select 
                                        name="dr"
                                        value={formData.dr}
                                        onChange={handleChange}
                                        style={{ flex: 2, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                                    >
                                        {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }}>
                                        <input 
                                            type="number"
                                            name="drProgress"
                                            value={formData.drProgress}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                            style={{ width: '100%', padding: '12px 5px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'right' }}
                                        />
                                        <span style={{ paddingRight: '10px', color: 'rgba(255,255,255,0.5)' }}>%</span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>Safety Rank (SR)</label>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <select 
                                        name="sr"
                                        value={formData.sr}
                                        onChange={handleChange}
                                        style={{ flex: 2, padding: '12px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '5px' }}
                                    >
                                        {ratingOptions.map(r => <option key={r} value={r}>{r}</option>)}
                                    </select>
                                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }}>
                                        <input 
                                            type="number"
                                            name="srProgress"
                                            value={formData.srProgress}
                                            onChange={handleChange}
                                            min="0"
                                            max="100"
                                            style={{ width: '100%', padding: '12px 5px', background: 'transparent', border: 'none', color: '#fff', textAlign: 'right' }}
                                        />
                                        <span style={{ paddingRight: '10px', color: 'rgba(255,255,255,0.5)' }}>%</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                disabled={submitting}
                                style={{ 
                                    marginTop: '15px',
                                    padding: '15px', 
                                    background: submitting ? '#555' : 'linear-gradient(90deg, #00d2ff, #0088ff)', 
                                    color: '#fff', 
                                    border: 'none', 
                                    borderRadius: '5px', 
                                    fontWeight: 'bold',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    transition: '0.3s',
                                    boxShadow: '0 5px 15px rgba(0,210,255,0.3)'
                                }}
                            >
                                {submitting ? '送信中...' : '記録を保存する'}
                            </button>
                        </form>
                    </div>

                    <div style={{ 
                        background: 'rgba(20,20,20,0.8)', 
                        padding: '25px', 
                        borderRadius: '15px', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                        backdropFilter: 'blur(5px)',
                        display: 'flex',
                        flexDirection: 'column'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                            <h2 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                MY RATING PROGRESS
                            </h2>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                <button 
                                    onClick={() => handleDownloadImage(chartRef, 'Graph')}
                                    style={{ background: '#ff003c', color: '#fff', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                                >
                                    グラフをシェア
                                </button>
                            </div>
                        </div>

                        <div ref={chartRef} style={{ padding: '10px', borderRadius: '10px', background: 'transparent', marginBottom: '30px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '15px', display: 'none' }} className="chart-watermark">
                                <img src="/assets/logo.png" alt="WECSS" style={{ height: '40px', marginBottom: '10px' }} />
                                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.2rem', letterSpacing: '1px' }}>DR/SR TRACKER</h3>
                                <p style={{ color: '#00d2ff', margin: 0, fontWeight: 'bold' }}>Driver: {myDriverName}</p>
                            </div>

                            {loading && chartData.length === 0 ? (
                                <div style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.5)' }}>読み込み中...</div>
                            ) : chartData.length === 0 ? (
                                <div style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'rgba(255,255,255,0.5)' }}>まだ記録がありません。最初の入力をしてみましょう！</div>
                            ) : (
                                <div style={{ width: '100%', height: '250px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" tick={{fontSize: 12}} />
                                            <YAxis 
                                                domain={[1, 12]} 
                                                ticks={[1, 4, 7, 10]} 
                                                tickFormatter={formatYAxis} 
                                                stroke="rgba(255,255,255,0.5)" 
                                                width={70}
                                                tick={{fontSize: 12}}
                                            />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Legend wrapperStyle={{ paddingTop: '10px' }} />
                                            <Line type="linear" name="Driver Rank (DR)" dataKey="drValue" stroke="#ff003c" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                            <Line type="linear" name="Safety Rank (SR)" dataKey="srValue" stroke="#00d2ff" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            )}
                        </div>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
                            <h2 style={{ fontSize: '1.3rem', color: '#fff', fontWeight: 'bold', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                MY PROFILE CARD
                            </h2>
                            <button 
                                onClick={() => handleDownloadImage(cardRef, 'Card')}
                                style={{ background: '#00d2ff', color: '#000', border: 'none', padding: '8px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}
                            >
                                PROFILE CARD をシェア
                            </button>
                        </div>
                        
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginBottom: '15px' }}>
                            下の入力欄からプロフィールを編集すると、リアルタイムでカードに反映されます。
                        </p>

                        {/* プロフィール編集フォーム */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '30px', background: 'rgba(0,0,0,0.5)', padding: '20px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>よく乗るクラス</label>
                                <select name="favClass" value={profile.favClass} onChange={handleProfileChange} style={{ width: '100%', padding: '10px', background: 'rgba(20,20,20,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }}>
                                    <option value="Hypercar">Hypercar</option>
                                    <option value="LMP2">LMP2</option>
                                    <option value="LMP3">LMP3</option>
                                    <option value="LMGT3">LMGT3</option>
                                    <option value="GTE">GTE</option>
                                    <option value="All Classes">All Classes (何でも乗る)</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>好きな車種</label>
                                <input type="text" name="favCar" value={profile.favCar} onChange={handleProfileChange} placeholder="例: Ferrari 499P" style={{ width: '100%', padding: '10px', background: 'rgba(20,20,20,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>肩書き / 所属チーム（通り名）</label>
                                <input type="text" name="driverTitle" value={profile.driverTitle || ''} onChange={handleProfileChange} placeholder="例: WECSS DRIVER" style={{ width: '100%', padding: '10px', background: 'rgba(20,20,20,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>主なプレイ時間帯</label>
                                <input type="text" name="playTime" value={profile.playTime} onChange={handleProfileChange} placeholder="例: 平日21:00〜24:00" style={{ width: '100%', padding: '10px', background: 'rgba(20,20,20,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>使用機材 (SIM RIG)</label>
                                <input type="text" name="equipment" value={profile.equipment || ''} onChange={handleProfileChange} placeholder="例: Fanatec DD Pro 8Nm / CSL Pedals Load Cell" style={{ width: '100%', padding: '10px', background: 'rgba(20,20,20,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }} />
                            </div>
                            <div style={{ gridColumn: '1 / -1' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', marginBottom: '5px' }}>フリーコメント（意気込み・メッセージなど）</label>
                                <input type="text" name="comment" value={profile.comment} onChange={handleProfileChange} placeholder="例: 一緒に練習してくれるフレンド募集中です！" style={{ width: '100%', padding: '10px', background: 'rgba(20,20,20,0.8)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '5px' }} />
                            </div>
                            
                            {/* 画像アップロード */}
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#00d2ff', marginBottom: '8px', fontWeight: 'bold' }}>👤 アバター画像 (アイコン)</label>
                                <input type="file" accept="image/*" onChange={(e) => handleProfileImageUpload(e, 'avatarImage')} style={{ fontSize: '0.8rem', color: '#ccc' }} />
                            </div>
                            <div style={{ background: 'rgba(255,255,255,0.05)', padding: '15px', borderRadius: '8px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: '#00d2ff', marginBottom: '8px', fontWeight: 'bold' }}>🏎️ 愛車の画像 (背景用)</label>
                                <input type="file" accept="image/*" onChange={(e) => handleProfileImageUpload(e, 'carImage')} style={{ fontSize: '0.8rem', color: '#ccc' }} />
                                <p style={{ margin: '5px 0 0 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>※愛車画像を設定すると、右側エリアの背景になります。</p>
                            </div>
                        </div>

                        {/* プロフィールカード表示エリア (横長デザイン) */}
                        <div style={{ overflowX: 'auto', paddingBottom: '20px' }}>
                            <div ref={cardRef} style={{
                                width: '800px', // 横長固定サイズ
                                background: 'linear-gradient(135deg, #111 0%, #1a1a1a 100%)',
                                border: `2px solid ${drColor}50`,
                                borderRadius: '15px',
                                padding: '0',
                                position: 'relative',
                                overflow: 'hidden',
                                margin: '0 auto',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.9)',
                                display: 'flex',
                                fontFamily: '"Inter", sans-serif'
                            }}>
                                {/* 背景の装飾 */}
                                <div style={{ position: 'absolute', top: '-50%', left: '-20%', width: '150%', height: '200%', background: 'radial-gradient(circle, rgba(0,210,255,0.05) 0%, transparent 60%)', pointerEvents: 'none' }}></div>
                                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '300px', height: '300px', background: `radial-gradient(circle, ${srColor}15 0%, transparent 70%)`, pointerEvents: 'none' }}></div>
                                
                                {/* 左サイド（ランク＆基本情報） */}
                                <div style={{ width: '350px', background: 'rgba(0,0,0,0.6)', padding: '30px', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 2, backdropFilter: 'blur(5px)' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '8px', background: `linear-gradient(90deg, ${drColor}, ${srColor})` }}></div>
                                    
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px', marginTop: '10px' }}>
                                        {profile.avatarImage ? (
                                            <img src={profile.avatarImage} alt="Avatar" style={{ 
                                                width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover',
                                                border: `3px solid ${drColor}`, boxShadow: `0 0 20px ${drColor}60`
                                            }} />
                                        ) : (
                                            <div style={{ 
                                                width: '70px', height: '70px', borderRadius: '50%', background: '#222',
                                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                                fontSize: '2.5rem', fontWeight: 'bold', border: `3px solid ${drColor}`,
                                                color: '#fff', boxShadow: `0 0 20px ${drColor}60`
                                            }}>
                                                {myDriverName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <h3 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', letterSpacing: '1px', color: '#fff' }}>{myDriverName}</h3>
                                            <span style={{ fontSize: '0.8rem', color: '#00d2ff', letterSpacing: '2px', fontWeight: 'bold' }}>{profile.driverTitle || 'LMU DRIVER'}</span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '10px', borderLeft: `4px solid ${drColor}` }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px' }}>DRIVER RANK</p>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: drColor }}>{currentDr.rankName}</p>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 'bold' }}>{currentDr.progress}%</p>
                                            </div>
                                        </div>
                                        <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '10px', borderLeft: `4px solid ${srColor}` }}>
                                            <p style={{ margin: '0 0 5px 0', fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)', letterSpacing: '2px' }}>SAFETY RANK</p>
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px' }}>
                                                <p style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: srColor }}>{currentSr.rankName}</p>
                                                <p style={{ margin: 0, fontSize: '1rem', color: '#fff', fontWeight: 'bold' }}>{currentSr.progress}%</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div style={{ marginTop: '40px' }}>
                                        <img src="/assets/logo.png" alt="WECSS" style={{ height: '40px', opacity: 0.8 }} />
                                    </div>
                                </div>

                                {/* 右サイド（詳細プロフィール） */}
                                <div style={{ flex: 1, padding: '30px 40px', position: 'relative', overflow: 'hidden' }}>
                                    
                                    {/* 右サイドの愛車背景画像 */}
                                    {profile.carImage && (
                                        <div style={{ 
                                            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, 
                                            backgroundImage: `url(${profile.carImage})`, backgroundSize: 'cover', backgroundPosition: 'center',
                                            opacity: 0.3, zIndex: 0, pointerEvents: 'none'
                                        }}></div>
                                    )}
                                    {profile.carImage && (
                                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(90deg, #1a1a1a 0%, transparent 100%)', zIndex: 1 }}></div>
                                    )}

                                    <div style={{ position: 'relative', zIndex: 2 }}>
                                        <h2 style={{ fontSize: '2.2rem', color: 'rgba(255,255,255,0.1)', position: 'absolute', top: '-10px', right: '-10px', margin: 0, fontWeight: '900', fontStyle: 'italic', pointerEvents: 'none', zIndex: -1 }}>LE MANS ULTIMATE</h2>
                                        
                                        <h4 style={{ color: '#fff', fontSize: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '25px', marginTop: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>PROFILE</h4>
                                        
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                            <div style={{ display: 'flex', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                <span style={{ width: '150px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 'bold' }}>FAV CLASS</span>
                                                <span style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>{profile.favClass || '-'}</span>
                                            </div>
                                            <div style={{ display: 'flex', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                <span style={{ width: '150px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 'bold' }}>FAV CAR</span>
                                                <span style={{ color: profile.favCar ? '#ffb300' : '#fff', fontSize: '1rem', fontWeight: profile.favCar ? 'bold' : 'normal' }}>{profile.favCar || '-'}</span>
                                            </div>
                                            <div style={{ display: 'flex', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                <span style={{ width: '150px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 'bold' }}>SIM RIG</span>
                                                <span style={{ color: '#fff', fontSize: '1rem' }}>{profile.equipment || '-'}</span>
                                            </div>
                                            <div style={{ display: 'flex', borderBottom: '1px dashed rgba(255,255,255,0.1)', paddingBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
                                                <span style={{ width: '150px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', fontWeight: 'bold' }}>PLAY TIME</span>
                                                <span style={{ color: '#fff', fontSize: '1rem' }}>{profile.playTime || '-'}</span>
                                            </div>
                                            <div style={{ marginTop: '10px' }}>
                                                <span style={{ display: 'block', color: '#00d2ff', fontSize: '0.9rem', fontWeight: 'bold', marginBottom: '10px', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>MESSAGE</span>
                                                <div style={{ background: 'rgba(0,0,0,0.6)', padding: '15px', borderRadius: '8px', borderLeft: '3px solid #00d2ff', color: '#fff', fontSize: '1rem', minHeight: '60px', wordBreak: 'break-word', backdropFilter: 'blur(3px)' }}>
                                                    {profile.comment || 'よろしくお願いします！'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </div>

                <div style={{ 
                    background: 'rgba(20,20,20,0.8)', 
                    padding: '25px', 
                    borderRadius: '15px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(5px)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 'bold', margin: 0 }}>RECENT UPDATES (MY DATA)</h2>
                        <button onClick={fetchHistory} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', padding: '5px 15px', borderRadius: '20px', cursor: 'pointer', fontSize: '0.8rem' }}>更新</button>
                    </div>
                    
                    <div style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '5px' }}>
                        {history.length === 0 && <p style={{color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginTop: '20px'}}>記録はありません</p>}
                        {history.map((entry, index) => {
                            const dateObj = new Date(entry.timestamp);
                            const dateStr = !isNaN(dateObj.getTime()) 
                                ? `${dateObj.getFullYear()}/${(dateObj.getMonth()+1).toString().padStart(2,'0')}/${dateObj.getDate().toString().padStart(2,'0')} ${dateObj.getHours().toString().padStart(2,'0')}:${dateObj.getMinutes().toString().padStart(2,'0')}`
                                : entry.timestamp;

                            return (
                                <div key={index} style={{ 
                                    background: 'rgba(0,0,0,0.4)', 
                                    padding: '10px 15px', 
                                    borderRadius: '8px', 
                                    marginBottom: '10px',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderLeft: '3px solid #00d2ff'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{entry.driverName}</div>
                                        <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.5)' }}>{dateStr}</div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '15px' }}>
                                        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.6rem', color: '#ff003c', display: 'block' }}>DR</span> <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{entry.dr}</span></div>
                                        <div style={{ textAlign: 'center' }}><span style={{ fontSize: '0.6rem', color: '#00d2ff', display: 'block' }}>SR</span> <span style={{ fontWeight: 'bold', color: '#fff', fontSize: '0.9rem' }}>{entry.sr}</span></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>

            </div>
            
            <style dangerouslySetInnerHTML={{__html: `
                @media (max-width: 768px) {
                    .tracker-top-grid {
                        grid-template-columns: 1fr !important;
                    }
                }
            `}} />
        </div>
    );
};

export default Tracker;
