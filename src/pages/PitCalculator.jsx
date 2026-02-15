import React from 'react';
import Calculator from '../components/Calculator';
import { Calculator as CalculatorIcon, Info } from 'lucide-react';
import './WeatherCheck.css'; // Reusing the CSS file for now as it contains the new styles

const PitCalculator = () => {
    return (
        <div className="pit-calc-container">
            <div className="pit-calc-content">
                <div className="pit-calc-header">
                    <h1 className="pit-calc-title">
                        <CalculatorIcon size={48} className="pit-header-icon" />
                        <span>Pit Strategy Calculator</span>
                    </h1>

                    <div className="pit-about-card">
                        <div className="pit-about-accent"></div>
                        <h3 className="pit-about-title">
                            <Info size={20} />
                            About This Tool
                        </h3>
                        <p className="pit-about-desc">
                            Le Mans Ultimate (LMU) 用のピットストップ戦略計算機トライアル版です。<br />
                            レース時間、サーキット、車両を選択し、目標ラップタイムと燃費を入力することで、
                            必要なピット回数や各スティントの長さを自動計算し、最適な戦略を提案します。
                        </p>
                    </div>
                </div>

                <Calculator />
            </div>
        </div>
    );
};

export default PitCalculator;
