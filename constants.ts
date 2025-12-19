
import { UserData, MetricConfig } from './types';

export const METRICS: MetricConfig[] = [
  { key: 'weight', label: 'น้ำหนัก', unit: 'กก.', isLowerBetter: true },
  { key: 'bmi', label: 'BMI', unit: '', isLowerBetter: true },
  { key: 'fat', label: 'ไขมัน', unit: '%', isLowerBetter: true },
  { key: 'sFat', label: 'ไขมันใต้ผิว', unit: '%', isLowerBetter: true },
  { key: 'muscle', label: 'กล้ามเนื้อ', unit: '%', isLowerBetter: false },
  { key: 'vFat', label: 'ไขมันช่องท้อง', unit: 'ระดับ', isLowerBetter: true },
];

export const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
];

export const YEARS = Array.from({ length: 8 }, (_, i) => (2568 + i).toString());

export const INITIAL_DATA: UserData[] = [
  { id: '1', name: 'อนุไชย์ ทองไล่เผ่า', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 71.4, month2: 0 }, bmi: { month1: 23.3, month2: 0 }, fat: { month1: 21.2, month2: 0 }, sFat: { month1: 14.7, month2: 0 }, muscle: { month1: 33.5, month2: 0 }, vFat: { month1: 7.5, month2: 0 } },
  { id: '2', name: 'ขวัญรัตน์ เจริญเผ่า', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 47.8, month2: 47 }, bmi: { month1: 18.9, month2: 18.6 }, fat: { month1: 28.4, month2: 28.9 }, sFat: { month1: 22.2, month2: 22.2 }, muscle: { month1: 26, month2: 25.8 }, vFat: { month1: 2, month2: 2 } },
  { id: '3', name: 'ชุติพร ใบยางยาง', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 62.2, month2: 60 }, bmi: { month1: 24.6, month2: 23.7 }, fat: { month1: 33.9, month2: 32.2 }, sFat: { month1: 29.1, month2: 27.6 }, muscle: { month1: 24.1, month2: 24.8 }, vFat: { month1: 6.5, month2: 5.5 } },
  { id: '4', name: 'ฟาริดา ทับฉ่ำ', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 74.9, month2: 71.2 }, bmi: { month1: 28.5, month2: 27.1 }, fat: { month1: 36.4, month2: 35.3 }, sFat: { month1: 33.2, month2: 31.6 }, muscle: { month1: 23.8, month2: 24.1 }, vFat: { month1: 9, month2: 8 } },
  { id: '5', name: 'หทัยรัตน์ แก้วอร่ามศรี', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 72.2, month2: 74 }, bmi: { month1: 28.6, month2: 29.3 }, fat: { month1: 34.9, month2: 33.9 }, sFat: { month1: 32.5, month2: 32.5 }, muscle: { month1: 24.4, month2: 25.3 }, vFat: { month1: 9, month2: 9.5 } },
  { id: '6', name: 'ณัฐวรรณ เชื้ออ่ำ', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 78.7, month2: 75.5 }, bmi: { month1: 32.8, month2: 31.8 }, fat: { month1: 15, month2: 39.9 }, sFat: { month1: 37.9, month2: 37.4 }, muscle: { month1: 22.1, month2: 21.7 }, vFat: { month1: 15, month2: 14 } },
  { id: '7', name: 'พิริยา เจริญรัตน์', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 50.8, month2: 50.9 }, bmi: { month1: 19.8, month2: 19.9 }, fat: { month1: 28.9, month2: 27.9 }, sFat: { month1: 23.2, month2: 22.7 }, muscle: { month1: 25.7, month2: 26.1 }, vFat: { month1: 3, month2: 3 } },
  { id: '8', name: 'จักรกฤษณ์ ยอดทอง', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 55.5, month2: 54.4 }, bmi: { month1: 18.2, month2: 17.8 }, fat: { month1: 12.7, month2: 12.2 }, sFat: { month1: 11.7, month2: 11.2 }, muscle: { month1: 36, month2: 35.8 }, vFat: { month1: 0.5, month2: 0.5 } },
  { id: '9', name: 'สุชามาศ เกตุแก้ว', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 50.1, month2: 50 }, bmi: { month1: 18.6, month2: 18.5 }, fat: { month1: 25.3, month2: 21 }, sFat: { month1: 20.5, month2: 20 }, muscle: { month1: 27.5, month2: 27.6 }, vFat: { month1: 2, month2: 2 } },
  { id: '10', name: 'สิทธิชัย ทิหนัด', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 73.1, month2: 75.3 }, bmi: { month1: 25.6, month2: 26.4 }, fat: { month1: 27.9, month2: 27.4 }, sFat: { month1: 19.3, month2: 19 }, muscle: { month1: 30.7, month2: 30.8 }, vFat: { month1: 9.5, month2: 10.5 } },
  { id: '11', name: 'อังศุมา ศิลาแสง', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 95.6, month2: 85.2 }, bmi: { month1: 33.5, month2: 29.5 }, fat: { month1: 40.4, month2: 36.6 }, sFat: { month1: 38.8, month2: 34 }, muscle: { month1: 22.8, month2: 24.5 }, vFat: { month1: 15, month2: 10 } },
  { id: '12', name: 'กันต์ แสงอุทัย', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 101, month2: 106.8 }, bmi: { month1: 34.9, month2: 37.4 }, fat: { month1: 34.5, month2: 36.2 }, sFat: { month1: 24.9, month2: 26.3 }, muscle: { month1: 27.7, month2: 26.8 }, vFat: { month1: 20, month2: 23 } },
  { id: '13', name: 'สิริพร โพธิยะ', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 47.5, month2: 46.2 }, bmi: { month1: 20, month2: 19 }, fat: { month1: 21.4, month2: 20.5 }, sFat: { month1: 19.5, month2: 18.3 }, muscle: { month1: 28.7, month2: 29 }, vFat: { month1: 2.5, month2: 2 } },
  { id: '14', name: 'กิตติยา อดทน', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 76.2, month2: 74.4 }, bmi: { month1: 30.5, month2: 29.8 }, fat: { month1: 38.4, month2: 38.6 }, sFat: { month1: 35.6, month2: 35.2 }, muscle: { month1: 23, month2: 22.6 }, vFat: { month1: 13.5, month2: 13 } },
  { id: '15', name: 'อธิพัฒน์ วงศ์สวัสดิ์', company: 'เจ้าพระยาทัวร์ริสท์โบ๊ท', weight: { month1: 93.4, month2: 91.4 }, bmi: { month1: 35.6, month2: 31.3 }, fat: { month1: 35.3, month2: 28.3 }, sFat: { month1: 36.8, month2: 20.4 }, muscle: { month1: 23.6, month2: 30.3 }, vFat: { month1: 16.5, month2: 18 } },
];
