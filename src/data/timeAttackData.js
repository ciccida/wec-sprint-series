/**
 * Time Attack Leaderboard Data
 * (Starting from Season 3 / Vol3)
 * Structure: Season -> Round -> { image: string, results: array }
 */
export const timeAttackData = {
  "Vol3": {
    "1": {
      image: "/images/ta_s3_rd1.jpg", 
      results: [
        { id: 1, rank: 1, name: "Sample Driver Alpha", car: "Ferrari 499P", class: "HYPERCAR", time: "1:38.452", gap: "-", attempt: 12 },
        { id: 2, rank: 2, name: "Sample Driver Beta", car: "Toyota GR010", class: "HYPERCAR", time: "1:38.567", gap: "+0.115", attempt: 8 },
        { id: 3, rank: 3, name: "Sample Driver Gamma", car: "Porsche 963", class: "HYPERCAR", time: "1:38.890", gap: "+0.438", attempt: 15 },
        { id: 4, rank: 1, name: "GT Specialist A", car: "Porsche 911 GT3 R", class: "LMGT3", time: "1:52.123", gap: "-", attempt: 6 },
        { id: 5, rank: 2, name: "GT Specialist B", car: "Ferrari 296 GT3", class: "LMGT3", time: "1:52.456", gap: "+0.333", attempt: 10 }
      ]
    },
    "2": { image: "", results: [] },
    "3": { image: "", results: [] },
    "4": { image: "", results: [] },
    "5": { image: "", results: [] },
    "6": { image: "", results: [] },
    "7": { image: "", results: [] },
    "8": { image: "", results: [] }
  }
};
