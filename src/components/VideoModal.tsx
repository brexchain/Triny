import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useIsPresent } from 'motion/react';
import { X, ExternalLink } from 'lucide-react';
import ReactPlayer from 'react-player';

interface VideoModalProps {
  url: string | null;
  onClose: () => void;
}

function VideoPlayerWrapper({ url, isReady, setIsReady }: { url: string, isReady: boolean, setIsReady: (val: boolean) => void }) {
  const isPresent = useIsPresent();
  
  const Player = ReactPlayer as any;
  
  return (
    <Player
      url={url as string}
      width="100%"
      height="100%"
      controls
      playing={isReady && isPresent}
      onReady={() => setIsReady(true)}
      onError={(e: any) => console.error("ReactPlayer Error:", e)}
    />
  );
}

export function VideoModal({ url, onClose }: VideoModalProps) {
  const [isReady, setIsReady] = useState(false);
  const [loadTimeout, setLoadTimeout] = useState(false);

  useEffect(() => {
    let timer: any;
    if (url && !isReady) {
      timer = setTimeout(() => {
        setLoadTimeout(true);
      }, 6000);
    }
    return () => clearTimeout(timer);
  }, [url, isReady]);

  const handleClose = () => {
    setIsReady(false);
    setLoadTimeout(false);
    onClose();
  };

  return (
    <AnimatePresence onExitComplete={() => {
      setIsReady(false);
      setLoadTimeout(false);
    }}>
      {url && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4 z-20 flex gap-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20 flex items-center gap-2 px-4 shadow-lg group"
                title="Direkt auf Facebook/Instagram ansehen"
              >
                <span className="text-[10px] uppercase tracking-tighter font-display hidden group-hover:block">Extern öffnen</span>
                <ExternalLink size={20} />
              </a>
              <button
                onClick={handleClose}
                className="p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20 shadow-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="w-full h-full">
              <VideoPlayerWrapper url={url} isReady={isReady} setIsReady={setIsReady} />
            </div>
            
            {(!isReady || loadTimeout) && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/40">
                <div className="text-center px-6">
                  {!isReady && !loadTimeout && (
                    <>
                      <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                      <p className="text-white/60 text-sm font-hand">Video wird geladen...</p>
                    </>
                  )}
                  
                  {loadTimeout && !isReady && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="pointer-events-auto bg-neutral-900/80 p-6 rounded-2xl border border-white/10 backdrop-blur-md"
                    >
                      <p className="text-white text-lg font-display mb-4">Lade-Problem? (Facebook/Adblocker)</p>
                      <p className="text-white/60 text-sm font-hand mb-6">Einige Browser blockieren Facebook-Videos. Nutze bitte den externen Link:</p>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-accent text-white px-6 py-2 rounded-full hover:bg-accent/80 transition-all font-display text-lg"
                      >
                        <ExternalLink size={18} /> Auf Facebook abspielen
                      </a>
                    </motion.div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
