import { useEffect, useRef, useState } from "react";
import { YIN } from "pitchfinder";
import  Midi  from "@tonaljs/midi";

export default function Tuner() {
  const [note, setNote] = useState<string>("–");
  const [cents, setCents] = useState<number>(0);
  const [active, setActive] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataRef = useRef<Float32Array | null>(null);
  const detector = useRef(YIN({ sampleRate: 44100 }));

  // Start/stop mic
  const toggleTuner = async () => {
    if (active) {
      audioCtxRef.current?.close();
      setActive(false);
    } else {
      const ctx = new AudioContext();
      audioCtxRef.current = ctx;
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;
      dataRef.current = new Float32Array(analyser.fftSize);
      detector.current = YIN({ sampleRate: ctx.sampleRate });
      setActive(true);
    }
  };

  // Poll for pitch
  useEffect(() => {
    let raf: number;
    const tick = () => {
      const analyser = analyserRef.current;
      const data = dataRef.current;
      if (active && analyser && data) {
        analyser.getFloatTimeDomainData(data);
        const frequency = detector.current(data) || 0;
        if (frequency > 0) {
          // freq → midi (decimal)
          const midi = Midi.freqToMidi(frequency);
          const rounded = Math.round(midi);
          // midi → pitch-class note
          const name = Midi.midiToNoteName(rounded, {
            pitchClass: true,
            sharps: true,
          });
          // cents difference
          const diff = Math.round((midi - rounded) * 100);
          setNote(name);
          setCents(diff);
        } else {
          setNote("–");
          setCents(0);
        }
      }
      raf = requestAnimationFrame(tick);
    };
    tick();
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <div className="p-4 bg-gray-900 text-white rounded-lg max-w-xs mx-auto mb-6">
      <button
        onClick={toggleTuner}
        className={`px-4 py-2 rounded ${
          active ? "bg-red-600" : "bg-green-600"
        }`}
      >
        {active ? "Stop Tuner" : "Start Tuner"}
      </button>

      <div className="mt-4 text-center">
        <div className="text-5xl font-bold">{note}</div>
        <div className="mt-1 text-lg">
          {cents > 0 ? `+${cents}` : cents < 0 ? `${cents}` : "–"}¢
        </div>
      </div>

      {/* Tuner needle */}
      <div className="relative h-2 bg-gray-700 rounded mt-4 overflow-hidden">
        <div
          className="absolute top-0 h-full bg-white"
          style={{ left: `${50 + cents / 2}%`, width: "2px" }}
        />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gray-500" />
      </div>

      <div className="flex justify-between text-sm mt-1">
        <span>-50¢</span>
        <span>0¢</span>
        <span>+50¢</span>
      </div>
    </div>
  );
}
