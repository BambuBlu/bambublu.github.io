"use client"
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Terminal } from 'lucide-react';
import styles from './hackerterminal.module.css';
import { useAppContext } from "@/app/context/AppContext";

type OutputLine = {
  type: 'command' | 'response' | 'error';
  text: string;
  colorOverride?: string;
};

export function HackerTerminal() {
  const { lang, t } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<OutputLine[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [themeColor, setThemeColor] = useState('#4ade80'); 
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentScore, setCurrentScore] = useState(0); 
  
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScore = (e: Event) => setCurrentScore((e as CustomEvent).detail);
    window.addEventListener('updateGameScore', handleScore);
    return () => window.removeEventListener('updateGameScore', handleScore);
  }, []);

  useEffect(() => {
    if (output.length === 0 || output.length <= 2) {
      setOutput([
        { type: 'response', text: t.terminal.init },
        { type: 'response', text: t.terminal.granted }
      ]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.key === 'k') || e.key === '`' || e.key === '~') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && !isExecuting) setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen, isExecuting]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [output, isOpen]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (isExecuting) return;

    const cmd = input.trim();
    if (!cmd) return;

    const newOutput = [...output, { type: 'command', text: `${t.terminal.prompt} ${cmd}` } as OutputLine];
    const args = cmd.split(' ');
    const mainCmd = args[0].toLowerCase();

    if (mainCmd === 'github' && args[1] === '--stats') {
        setIsExecuting(true);
        newOutput.push({ type: 'response', text: t.terminal.githubLoading });
        setOutput(newOutput); setInput('');
        
        fetch('https://api.github.com/users/BambuBlu')
          .then(res => res.json())
          .then(data => {
              const statsMsg = lang === 'es' 
                ? `\n[+] Usuario: ${data.login}\n[+] Repositorios Públicos: ${data.public_repos}\n[+] Seguidores: ${data.followers}\n[+] Bio: ${data.bio || 'Sin bio'}`
                : `\n[+] User: ${data.login}\n[+] Public Repos: ${data.public_repos}\n[+] Followers: ${data.followers}\n[+] Bio: ${data.bio || 'No bio'}`;
              setOutput(prev => [...prev, { type: 'response', text: statsMsg, colorOverride: '#00f3ff' }]);
              setIsExecuting(false);
          })
          .catch(() => { setOutput(prev => [...prev, { type: 'error', text: t.terminal.apiError }]); setIsExecuting(false); });
        return; 
    }

    if (mainCmd === 'scan' || mainCmd === 'whois') {
        setIsExecuting(true);
        newOutput.push({ type: 'response', text: t.terminal.scanLoading });
        setOutput(newOutput); setInput('');
        
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
              const msg = lang === 'es'
                ? `\n[!] ADVERTENCIA: Conexión rastreada.\n[+] IP Detectada: ${data.ip}\n[+] Ubicación: ${data.city}, ${data.region}, ${data.country_name}\n[+] Proveedor (ISP): ${data.org}`
                : `\n[!] WARNING: Connection traced.\n[+] IP Detected: ${data.ip}\n[+] Location: ${data.city}, ${data.region}, ${data.country_name}\n[+] ISP: ${data.org}`;
              setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#ef4444' }]);
              setIsExecuting(false);
          })
          .catch(() => { setOutput(prev => [...prev, { type: 'error', text: t.terminal.apiError }]); setIsExecuting(false); });
        return;
    }

    if (mainCmd === 'spotify') {
        const subAction = args[1]?.toLowerCase();
        setIsExecuting(true);

        // Definir qué pedir y qué mensaje mostrar
        let url = '/api/spotify';
        if (subAction === '--top') {
            url = '/api/spotify?action=top';
            newOutput.push({ type: 'response', text: t.terminal.spotifyTopLoading });
        } else if (subAction === '--playlist') {
            url = '/api/spotify?action=playlist';
            newOutput.push({ type: 'response', text: t.terminal.spotifyPlaylistLoading });
        } else {
            newOutput.push({ type: 'response', text: t.terminal.spotifyLoading });
        }
        
        setOutput(newOutput); setInput('');
        
        fetch(url)
          .then(res => res.json())
          .then(data => {
              if (data.type === 'top') {
                  let msg = lang === 'es' ? `\n TOP 5 CANCIONES (Último mes):\n` : `\n TOP 5 TRACKS (Last month):\n`;
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  data.tracks.forEach((t: any, idx: number) => { msg += ` ${idx + 1}. ${t.title} - ${t.artist}\n`; });
                  setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#1db954' }]);
              } 
              else if (data.type === 'playlist') {
                  const msg = lang === 'es' 
                    ? `\n PLAYLIST RECOMENDADA:\n Nombre: ${data.name}\n Seguidores: ${data.followers}\n Desc: ${data.description}\n Link: ${data.url}`
                    : `\n RECOMMENDED PLAYLIST:\n Name: ${data.name}\n Followers: ${data.followers}\n Desc: ${data.description}\n Link: ${data.url}`;
                  setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#1db954' }]);
              } 
              else {
                  if (data.type === 'now') {
                      const msg = lang === 'es'
                        ? `\n Tobias está escuchando ahora:\n Canción: ${data.title}\n Artista: ${data.artist}\n Link: ${data.songUrl}`
                        : `\n Tobias is currently listening to:\n Song: ${data.title}\n Artist: ${data.artist}\n Link: ${data.songUrl}`;
                      setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#1db954' }]);
                  } else if (data.type === 'recent') {
                      const msg = lang === 'es'
                        ? `\n Tobias está offline. Última canción escuchada:\n Canción: ${data.title}\n Artista: ${data.artist}\n Link: ${data.songUrl}`
                        : `\n Tobias is offline. Last played track:\n Song: ${data.title}\n Artist: ${data.artist}\n Link: ${data.songUrl}`;
                      setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#94a3b8' }]);
                  } else {
                      setOutput(prev => [...prev, { type: 'response', text: `\n${t.terminal.spotifyNotPlaying}`, colorOverride: '#94a3b8' }]);
                  }
              }
              setIsExecuting(false);
          })
          .catch(() => { 
              setOutput(prev => [...prev, { type: 'error', text: t.terminal.apiError }]); 
              setIsExecuting(false); 
          });
        return;
    }

    if (mainCmd === 'weather') {
        setIsExecuting(true);
        newOutput.push({ type: 'response', text: t.terminal.weatherLoading });
        setOutput(newOutput); setInput('');
        
        fetch('https://api.open-meteo.com/v1/forecast?latitude=-34.61315&longitude=-58.37723&current_weather=true')
          .then(res => res.json())
          .then(data => {
              const temp = data.current_weather.temperature;
              const wind = data.current_weather.windspeed;
              const msg = lang === 'es'
                ? `\n Ubicación: Buenos Aires, AR\n Temperatura: ${temp}°C\n Viento: ${wind} km/h`
                : `\n Location: Buenos Aires, AR\n Temperature: ${temp}°C\n Wind: ${wind} km/h`;
              setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#38bdf8' }]); 
              setIsExecuting(false);
          })
          .catch(() => { setOutput(prev => [...prev, { type: 'error', text: t.terminal.apiError }]); setIsExecuting(false); });
        return;
    }

    if (mainCmd === 'crypto') {
        const coin = args[1] ? args[1].toLowerCase() : 'bitcoin';
        let coinId = 'bitcoin';
        if (coin === 'eth' || coin === 'ethereum') coinId = 'ethereum';
        if (coin === 'sol' || coin === 'solana') coinId = 'solana';
        if (coin === 'doge' || coin === 'dogecoin') coinId = 'dogecoin';

        setIsExecuting(true);
        newOutput.push({ type: 'response', text: t.terminal.cryptoLoading.replace('{coin}', coinId) });
        setOutput(newOutput); setInput('');
        
        fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`)
          .then(res => res.json())
          .then(data => {
              if (data[coinId]) {
                  const price = data[coinId].usd;
                  const msg = `\n ${coinId.toUpperCase()}: $${price.toLocaleString()} USD`;
                  setOutput(prev => [...prev, { type: 'response', text: msg, colorOverride: '#fcd34d' }]); 
              } else {
                  setOutput(prev => [...prev, { type: 'error', text: lang === 'es' ? 'Moneda no encontrada. Prueba btc, eth o sol.' : 'Coin not found. Try btc, eth or sol.' }]);
              }
              setIsExecuting(false);
          })
          .catch(() => { setOutput(prev => [...prev, { type: 'error', text: t.terminal.apiError }]); setIsExecuting(false); });
        return;
    }

    if (mainCmd === 'joke') {
        setIsExecuting(true);
        newOutput.push({ type: 'response', text: t.terminal.jokeLoading });
        setOutput(newOutput); setInput('');
        
        fetch('https://v2.jokeapi.dev/joke/Programming?type=single&safe-mode')
          .then(res => res.json())
          .then(data => {
              setOutput(prev => [...prev, { type: 'response', text: `\n ${data.joke}`, colorOverride: '#f472b6' }]);
              setIsExecuting(false);
          })
          .catch(() => { setOutput(prev => [...prev, { type: 'error', text: t.terminal.apiError }]); setIsExecuting(false); });
        return;
    }

    if (mainCmd === 'matrix') {
      newOutput.push({ type: 'response', text: t.terminal.matrix });
      setOutput(newOutput); setInput(''); setIsExecuting(true);
      window.dispatchEvent(new CustomEvent('toggleMatrixMode'));
      let iterations = 0; const chars = "01ｦｱｳｴｵｶｷｹｺｻｼｽｾｿﾀﾂﾃﾅﾆﾇﾈﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ";
      const interval = setInterval(() => {
        let line = "";
        for(let j = 0; j < (window.innerWidth < 768 ? 20 : 50); j++) line += chars.charAt(Math.floor(Math.random() * chars.length)) + " ";
        setOutput(prev => [...prev, { type: 'response', text: line }]);
        iterations++;
        if (iterations >= 25) { clearInterval(interval); setIsExecuting(false); }
      }, 100);
      return;
    }

    if (mainCmd === 'hack') {
      setOutput(newOutput); setInput(''); setIsExecuting(true);
      setTimeout(() => setOutput(prev => [...prev, { type: 'response', text: t.terminal.hack1 }]), 600);
      setTimeout(() => setOutput(prev => [...prev, { type: 'response', text: t.terminal.hack2 }]), 1500);
      setTimeout(() => setOutput(prev => [...prev, { type: 'response', text: t.terminal.hack3 }]), 2400);
      setTimeout(() => { setOutput(prev => [...prev, { type: 'response', text: t.terminal.hack4 }]); setIsExecuting(false); }, 3500);
      return;
    }

    if (mainCmd === 'ping') {
      const host = args[1];
      if (!host) { newOutput.push({ type: 'error', text: t.terminal.pingErr }); } 
      else {
         newOutput.push({ type: 'response', text: `PING ${host} (192.168.1.1): 56 data bytes` });
         setOutput(newOutput); setInput(''); setIsExecuting(true);
         for(let i=1; i<=4; i++) {
            setTimeout(() => {
               setOutput(prev => [...prev, { type: 'response', text: `64 bytes from 192.168.1.1: icmp_seq=${i} ttl=116 time=${Math.floor(Math.random()*20 + 10)} ms` }]);
               if (i === 4) setIsExecuting(false);
            }, i * 800);
         }
         return;
      }
    }

    switch (mainCmd) {
      case 'help': newOutput.push({ type: 'response', text: t.terminal.help }); break;
      case 'whoami': newOutput.push({ type: 'response', text: t.terminal.whoami }); break;
      case 'projects': newOutput.push({ type: 'response', text: t.terminal.projectsList }); break;
      case 'clear': setOutput([]); setInput(''); return;
      case 'date': newOutput.push({ type: 'response', text: new Date().toString() }); break;
      case 'sudo':
        if (args.join(' ') === 'sudo rm -rf /') newOutput.push({ type: 'error', text: t.terminal.sudoSuccess });
        else newOutput.push({ type: 'error', text: t.terminal.sudoFail });
        break;
      case 'ls':
      case 'dir': newOutput.push({ type: 'response', text: t.terminal.ls }); break;
      case 'cat':
        const file = args[1]?.toLowerCase();
        if (file === 'about.txt') newOutput.push({ type: 'response', text: t.terminal.whoami });
        else if (file === 'contact.txt' || file === 'contacto.txt') newOutput.push({ type: 'response', text: t.terminal.contact });
        else if (file === 'secret.log') newOutput.push({ type: 'error', text: t.terminal.catSecret });
        else newOutput.push({ type: 'error', text: t.terminal.catError });
        break;
      case 'neofetch': newOutput.push({ type: 'response', text: t.terminal.neofetch }); break;
      case 'contact': newOutput.push({ type: 'response', text: t.terminal.contact }); break;
      case 'github':
        newOutput.push({ type: 'response', text: t.terminal.opening.replace('{link}', 'GitHub') });
        window.open('https://github.com/BambuBlu', '_blank');
        break;
      case 'coffee': newOutput.push({ type: 'response', text: t.terminal.coffee }); break;
      case 'secret': newOutput.push({ type: 'response', text: t.terminal.secret }); break;
      case 'skills': newOutput.push({ type: 'response', text: t.terminal.skills }); break;
      case 'theme':
        const color = args[1]?.toLowerCase();
        const colorMap: Record<string, string> = { green: '#4ade80', cyan: '#00f3ff', amber: '#f59e0b', pink: '#f472b6' };
        if (colorMap[color]) {
            setThemeColor(colorMap[color]);
            newOutput.push({ type: 'response', text: t.terminal.themeOk.replace('{color}', color) });
        } else {
            newOutput.push({ type: 'error', text: t.terminal.themeErr });
        }
        break;
      case 'konami':
        newOutput.push({ type: 'response', text: t.terminal.bossSummon, colorOverride: '#ef4444' });
        window.dispatchEvent(new CustomEvent('spawnKonamiBoss'));
        break;
      case 'motherlode':
        newOutput.push({ type: 'response', text: t.terminal.motherlode, colorOverride: '#fcd34d' });
        window.dispatchEvent(new CustomEvent('addCheatScore', { detail: 100 }));
        break;
      case 'shop':
        newOutput.push({ type: 'response', text: t.terminal.shopList, colorOverride: '#fcd34d' }); // Color dorado
        break;
      case 'buy':
        const itemToBuy = args[1]?.toLowerCase();
        
        if (!itemToBuy) {
            newOutput.push({ type: 'error', text: t.terminal.buyUsage });
        } else if (itemToBuy === 'classic') {
            window.dispatchEvent(new CustomEvent('purchaseItem', { detail: { item: 'classic', cost: 100 }}));
            newOutput.push({ type: 'response', text: t.terminal.buySuccess, colorOverride: '#4ade80' });
        } else if (itemToBuy === 'drone') {
            window.dispatchEvent(new CustomEvent('purchaseItem', { detail: { item: 'drone', cost: 500 }}));
            newOutput.push({ type: 'response', text: t.terminal.buySuccess, colorOverride: '#4ade80' });
        } else {
            newOutput.push({ type: 'error', text: t.terminal.buyFail });
        }
        break;
      default:
        newOutput.push({ type: 'error', text: t.terminal.notFound.replace('{cmd}', mainCmd) });
    }

    setOutput(newOutput);
    setInput('');
  };

  return (
    <>
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            data-ui="true"
            className={styles.terminal_trigger_btn}
            onClick={() => setIsOpen(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            title="Abrir Terminal (Ctrl+K)"
          >
            <Terminal size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-ui="true" 
            className={styles.terminal_overlay}
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            onPointerDown={(e) => e.stopPropagation()} 
            style={{ borderBottomColor: themeColor }}
          >
            <div className={styles.terminal_header}>
              <div className={styles.terminal_title} style={{ color: themeColor }}>
                <Terminal size={14} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'text-top' }} />
                TerminalOS - root@tobias
              </div>
              <button className={styles.close_btn} onClick={() => setIsOpen(false)} style={{ color: themeColor }}>
                <X size={18} />
              </button>
            </div>

            <div className={styles.terminal_body} onClick={() => !isExecuting && inputRef.current?.focus()}>
              {output.map((line, i) => (
                <p 
                  key={i} 
                  className={`${styles.output_line}`}
                  style={{ color: line.colorOverride || (line.type === 'error' ? '#ef4444' : (line.type === 'response' ? '#e2e8f0' : themeColor)) }}
                >
                  {line.text}
                </p>
              ))}
              
              {!isExecuting && (
                <form onSubmit={handleCommand} className={styles.input_row}>
                  <span className={styles.prompt} style={{ color: themeColor }}>{t.terminal.prompt}</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className={styles.terminal_input}
                    autoComplete="off"
                    spellCheck="false"
                    disabled={isExecuting}
                    autoFocus
                    style={{ color: '#e2e8f0' }}
                  />
                </form>
              )}
              <div ref={bottomRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}