import { useState, useEffect, useRef, useCallback } from 'react';

interface Planet {
  id: number;
  name: string;
  nameEn: string;
  color: string;
  size: number; // 显示大小(px)
  realDiameter: string; // 真实直径
  distanceFromSun: string; // 与太阳距离
  orbitRadius: number; // 轨道半径(px)
  orbitalPeriod: string; // 公转周期
  periodDays: number; // 公转周期(天) 用于计算速度
  description: string;
  ringColor?: string;
}

const planets: Planet[] = [
  {
    id: 1,
    name: '水星',
    nameEn: 'Mercury',
    color: '#b5b5b5',
    size: 8,
    realDiameter: '4,879 km',
    distanceFromSun: '5,790万 km',
    orbitRadius: 70,
    orbitalPeriod: '88 天',
    periodDays: 88,
    description: '太阳系中最小的行星，也是距离太阳最近的行星。表面温度变化极大，白天可达430°C，夜晚降至-180°C。'
  },
  {
    id: 2,
    name: '金星',
    nameEn: 'Venus',
    color: '#e8cda0',
    size: 12,
    realDiameter: '12,104 km',
    distanceFromSun: '1.082亿 km',
    orbitRadius: 100,
    orbitalPeriod: '225 天',
    periodDays: 225,
    description: '太阳系中最热的行星，浓密的大气层产生强烈的温室效应，表面温度高达465°C。自转方向与其他行星相反。'
  },
  {
    id: 3,
    name: '地球',
    nameEn: 'Earth',
    color: '#4da6ff',
    size: 13,
    realDiameter: '12,756 km',
    distanceFromSun: '1.496亿 km',
    orbitRadius: 140,
    orbitalPeriod: '365.25 天',
    periodDays: 365,
    description: '我们的家园，太阳系中唯一已知存在生命的行星。拥有液态水和适宜的大气层，是生命的摇篮。'
  },
  {
    id: 4,
    name: '火星',
    nameEn: 'Mars',
    color: '#e85d3a',
    size: 10,
    realDiameter: '6,792 km',
    distanceFromSun: '2.279亿 km',
    orbitRadius: 180,
    orbitalPeriod: '687 天',
    periodDays: 687,
    description: '被称为"红色星球"，表面富含氧化铁。拥有太阳系最高的山峰——奥林帕斯山（21.9km）和最大的峡谷。'
  },
  {
    id: 5,
    name: '木星',
    nameEn: 'Jupiter',
    color: '#d4a574',
    size: 28,
    realDiameter: '142,984 km',
    distanceFromSun: '7.786亿 km',
    orbitRadius: 240,
    orbitalPeriod: '11.86 年',
    periodDays: 4333,
    description: '太阳系中最大的行星，质量是其他所有行星总和的2.5倍。著名的大红斑是一个持续数百年的巨大风暴。'
  },
  {
    id: 6,
    name: '土星',
    nameEn: 'Saturn',
    color: '#f0d68a',
    size: 24,
    realDiameter: '120,536 km',
    distanceFromSun: '14.34亿 km',
    orbitRadius: 310,
    orbitalPeriod: '29.46 年',
    periodDays: 10759,
    description: '以其壮观的环系统闻名，主要由冰粒和岩石碎片组成。密度极低，如果有足够大的水池，土星可以浮在水面上。',
    ringColor: '#c4a94d'
  },
  {
    id: 7,
    name: '天王星',
    nameEn: 'Uranus',
    color: '#7ec8e3',
    size: 18,
    realDiameter: '51,118 km',
    distanceFromSun: '28.71亿 km',
    orbitRadius: 370,
    orbitalPeriod: '84.01 年',
    periodDays: 30687,
    description: '自转轴几乎平行于公转轨道面，像是"躺着"绕太阳运行。大气中含有大量甲烷，使其呈现蓝绿色。'
  },
  {
    id: 8,
    name: '海王星',
    nameEn: 'Neptune',
    color: '#3d5ef5',
    size: 17,
    realDiameter: '49,528 km',
    distanceFromSun: '44.95亿 km',
    orbitRadius: 420,
    orbitalPeriod: '164.8 年',
    periodDays: 60190,
    description: '太阳系中距离太阳最远的行星，拥有太阳系中最强的风速，可达2,100 km/h。深蓝色外观源于大气中的甲烷。'
  }
];

function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [speed, setSpeed] = useState(1);
  const [selectedPlanet, setSelectedPlanet] = useState<Planet | null>(null);
  const [angles, setAngles] = useState<number[]>(planets.map(() => Math.random() * Math.PI * 2));
  const animationRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const animate = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp;
    const delta = timestamp - lastTimeRef.current;
    lastTimeRef.current = timestamp;

    if (isPlaying) {
      setAngles(prevAngles =>
        prevAngles.map((angle, index) => {
          const baseSpeed = 0.001 * (365 / planets[index].periodDays);
          return angle + baseSpeed * speed * delta;
        })
      );
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [isPlaying, speed]);

  useEffect(() => {
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [animate]);

  const handlePlanetClick = (planet: Planet) => {
    setSelectedPlanet(selectedPlanet?.id === planet.id ? null : planet);
  };

  const speedOptions = [0.5, 1, 2, 5, 10];

  return (
    <div className="w-full h-screen bg-gray-950 overflow-hidden relative flex flex-col">
      {/* 标题 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-wider">
          🌌 交互式太阳系教学演示
        </h1>
        <p className="text-gray-400 text-sm mt-1">点击行星查看详细信息</p>
      </div>

      {/* 太阳系容器 */}
      <div
        ref={containerRef}
        className="flex-1 relative flex items-center justify-center"
      >
        {/* 星空背景 */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({ length: 100 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-white animate-pulse"
              style={{
                width: Math.random() * 2 + 1 + 'px',
                height: Math.random() * 2 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                opacity: Math.random() * 0.7 + 0.3,
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's'
              }}
            />
          ))}
        </div>

        {/* 太阳 */}
        <div className="absolute z-10" style={{ width: '50px', height: '50px' }}>
          <div
            className="w-full h-full rounded-full"
            style={{
              background: 'radial-gradient(circle, #fff7a0 0%, #ffcc00 30%, #ff8c00 70%, #ff4500 100%)',
              boxShadow: '0 0 40px #ff8c00, 0 0 80px #ff6600, 0 0 120px #ff4500'
            }}
          />
        </div>

        {/* 轨道和行星 */}
        {planets.map((planet, index) => (
          <div key={planet.id}>
            {/* 轨道 */}
            <div
              className="absolute rounded-full border border-gray-700/40"
              style={{
                width: planet.orbitRadius * 2 + 'px',
                height: planet.orbitRadius * 2 + 'px',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
            />
            {/* 行星 */}
            <div
              className="absolute cursor-pointer transition-transform hover:scale-150 z-10"
              style={{
                width: planet.size + 'px',
                height: planet.size + 'px',
                top: '50%',
                left: '50%',
                transform: `translate(-50%, -50%) translate(${Math.cos(angles[index]) * planet.orbitRadius}px, ${Math.sin(angles[index]) * planet.orbitRadius}px)`,
              }}
              onClick={() => handlePlanetClick(planet)}
              title={planet.name}
            >
              <div
                className="w-full h-full rounded-full relative"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${planet.color}, ${planet.color}88)`,
                  boxShadow: `0 0 ${planet.size / 2}px ${planet.color}66`
                }}
              >
                {/* 土星环 */}
                {planet.ringColor && (
                  <div
                    className="absolute rounded-full border-2"
                    style={{
                      width: planet.size * 1.8 + 'px',
                      height: planet.size * 0.5 + 'px',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%) rotate(-20deg)',
                      borderColor: planet.ringColor,
                      background: 'transparent'
                    }}
                  />
                )}
              </div>
              {/* 行星名称标签 */}
              <div
                className="absolute text-xs text-white/70 whitespace-nowrap pointer-events-none"
                style={{
                  top: planet.size + 4 + 'px',
                  left: '50%',
                  transform: 'translateX(-50%)'
                }}
              >
                {planet.name}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 信息面板 */}
      {selectedPlanet && (
        <div className="absolute top-20 right-4 z-30 w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 rounded-xl p-5 shadow-2xl animate-fade-in">
          <button
            className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors"
            onClick={() => setSelectedPlanet(null)}
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-4">
            <div
              className="w-12 h-12 rounded-full flex-shrink-0"
              style={{
                background: `radial-gradient(circle at 30% 30%, ${selectedPlanet.color}, ${selectedPlanet.color}88)`,
                boxShadow: `0 0 15px ${selectedPlanet.color}66`
              }}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{selectedPlanet.name}</h2>
              <p className="text-gray-400 text-sm">{selectedPlanet.nameEn}</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">📏 直径</span>
              <span className="text-white font-medium">{selectedPlanet.realDiameter}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">☀️ 与太阳距离</span>
              <span className="text-white font-medium">{selectedPlanet.distanceFromSun}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700/50">
              <span className="text-gray-400">🔄 公转周期</span>
              <span className="text-white font-medium">{selectedPlanet.orbitalPeriod}</span>
            </div>
          </div>
          <p className="text-gray-300 text-sm mt-4 leading-relaxed">
            {selectedPlanet.description}
          </p>
        </div>
      )}

      {/* 控制面板 */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 bg-gray-900/90 backdrop-blur-md border border-gray-700 rounded-xl px-6 py-4 flex items-center gap-6 shadow-xl">
        {/* 播放/暂停 */}
        <button
          className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 flex items-center justify-center text-white transition-colors"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="3" y="2" width="4" height="12" rx="1" />
              <rect x="9" y="2" width="4" height="12" rx="1" />
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M4 2l10 6-10 6V2z" />
            </svg>
          )}
        </button>

        {/* 速度控制 */}
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm">速度:</span>
          <div className="flex gap-1">
            {speedOptions.map(s => (
              <button
                key={s}
                className={`px-2.5 py-1 rounded text-sm font-medium transition-colors ${
                  speed === s
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
                onClick={() => setSpeed(s)}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* 状态指示 */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
          <span className="text-gray-400 text-sm">{isPlaying ? '运行中' : '已暂停'}</span>
        </div>
      </div>
    </div>
  );
}

export default App;
