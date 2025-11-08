import React, { useEffect, useState, useRef } from "react";
import {
  Globe,
  Zap,
  Radio,
  Tv,
  User
} from "lucide-react";

/**
 * Election Broadcast Ultimate
 * A single-file React component (JSX) that simulates an election broadcast dashboard.
 *
 * NOTE:
 * - This file includes a robust helper `callAI` to safely call AI providers (OpenAI or Anthropic)
 *   when API keys are available in environment variables:
 *     NEXT_PUBLIC_OPENAI_API_KEY or NEXT_PUBLIC_ANTHROPIC_API_KEY
 * - For security you should NOT store secret API keys in client-side env for a public site.
 *   Instead create a server-side proxy (e.g., Next.js API route) that holds the secret key
 *   and call that from the client.
 *
 * This file is a runnable, self-contained component intended to replace the broken version
 * in the repository. It focuses on adding the fix described: robust AI calls + CSS class
 * .animate-zoomIn (so animation class usage doesn't fail) + graceful fallback to non-AI tweets.
 */

/* -------------------------
   Static data (states, users)
   ------------------------- */
const STATES = [
  { name: "Alabama", code: "AL", votes: 9, region: "South", reporting: 0 },
  { name: "Alaska", code: "AK", votes: 3, region: "West", reporting: 0 },
  { name: "Arizona", code: "AZ", votes: 11, region: "West", reporting: 0 },
  { name: "Arkansas", code: "AR", votes: 6, region: "South", reporting: 0 },
  { name: "California", code: "CA", votes: 54, region: "West", reporting: 0 },
  { name: "Colorado", code: "CO", votes: 10, region: "West", reporting: 0 },
  { name: "Connecticut", code: "CT", votes: 7, region: "Northeast", reporting: 0 },
  { name: "Delaware", code: "DE", votes: 3, region: "South", reporting: 0 },
  { name: "Florida", code: "FL", votes: 30, region: "South", reporting: 0 },
  { name: "Georgia", code: "GA", votes: 16, region: "South", reporting: 0 },
  { name: "Hawaii", code: "HI", votes: 4, region: "West", reporting: 0 },
  { name: "Idaho", code: "ID", votes: 4, region: "West", reporting: 0 },
  { name: "Illinois", code: "IL", votes: 19, region: "Midwest", reporting: 0 },
  { name: "Indiana", code: "IN", votes: 11, region: "Midwest", reporting: 0 },
  { name: "Iowa", code: "IA", votes: 6, region: "Midwest", reporting: 0 },
  { name: "Kansas", code: "KS", votes: 6, region: "Midwest", reporting: 0 },
  { name: "Kentucky", code: "KY", votes: 8, region: "South", reporting: 0 },
  { name: "Louisiana", code: "LA", votes: 8, region: "South", reporting: 0 },
  { name: "Maine", code: "ME", votes: 4, region: "Northeast", reporting: 0 },
  { name: "Maryland", code: "MD", votes: 10, region: "South", reporting: 0 },
  { name: "Massachusetts", code: "MA", votes: 11, region: "Northeast", reporting: 0 },
  { name: "Michigan", code: "MI", votes: 15, region: "Midwest", reporting: 0 },
  { name: "Minnesota", code: "MN", votes: 10, region: "Midwest", reporting: 0 },
  { name: "Mississippi", code: "MS", votes: 6, region: "South", reporting: 0 },
  { name: "Missouri", code: "MO", votes: 10, region: "Midwest", reporting: 0 },
  { name: "Montana", code: "MT", votes: 3, region: "West", reporting: 0 },
  { name: "Nebraska", code: "NE", votes: 5, region: "Midwest", reporting: 0 },
  { name: "Nevada", code: "NV", votes: 6, region: "West", reporting: 0 },
  { name: "New Hampshire", code: "NH", votes: 4, region: "Northeast", reporting: 0 },
  { name: "New Jersey", code: "NJ", votes: 14, region: "Northeast", reporting: 0 },
  { name: "New Mexico", code: "NM", votes: 5, region: "West", reporting: 0 },
  { name: "New York", code: "NY", votes: 28, region: "Northeast", reporting: 0 },
  { name: "North Carolina", code: "NC", votes: 16, region: "South", reporting: 0 },
  { name: "North Dakota", code: "ND", votes: 3, region: "Midwest", reporting: 0 },
  { name: "Ohio", code: "OH", votes: 17, region: "Midwest", reporting: 0 },
  { name: "Oklahoma", code: "OK", votes: 7, region: "South", reporting: 0 },
  { name: "Oregon", code: "OR", votes: 8, region: "West", reporting: 0 },
  { name: "Pennsylvania", code: "PA", votes: 19, region: "Northeast", reporting: 0 },
  { name: "Rhode Island", code: "RI", votes: 4, region: "Northeast", reporting: 0 },
  { name: "South Carolina", code: "SC", votes: 9, region: "South", reporting: 0 },
  { name: "South Dakota", code: "SD", votes: 3, region: "Midwest", reporting: 0 },
  { name: "Tennessee", code: "TN", votes: 11, region: "South", reporting: 0 },
  { name: "Texas", code: "TX", votes: 40, region: "South", reporting: 0 },
  { name: "Utah", code: "UT", votes: 6, region: "West", reporting: 0 },
  { name: "Vermont", code: "VT", votes: 3, region: "Northeast", reporting: 0 },
  { name: "Virginia", code: "VA", votes: 13, region: "South", reporting: 0 },
  { name: "Washington", code: "WA", votes: 12, region: "West", reporting: 0 },
  { name: "West Virginia", code: "WV", votes: 4, region: "South", reporting: 0 },
  { name: "Wisconsin", code: "WI", votes: 10, region: "Midwest", reporting: 0 },
  { name: "Wyoming", code: "WY", votes: 3, region: "West", reporting: 0 },
  { name: "District of Columbia", code: "DC", votes: 3, region: "South", reporting: 0 }
];

const BATTLEGROUND = ["PA", "GA", "AZ", "WI", "MI", "NV", "NC"];

const userNames = [
  "PoliticalJunkie",
  "VoterMom2024",
  "SwingStateWatch",
  "ElectionNerd",
  "CivicDuty",
  "DemocracyFan",
  "RedStateBlue",
  "PurpleAmerica",
  "IndependentVoice",
  "YouthVote2024"
];

/* -------------------------
   Helper: non-AI tweet templates
   ------------------------- */
const getNonAITweet = (type, data) => {
  const templates = {
    stateCalled: [
      `BREAKING: ${data.state} called for ${data.winner} with ${data.percentage}% of the vote! ${data.votes} electoral votes secured. #Election2024`,
      `${data.state} goes to ${data.winner}! Victory margin: ${data.margin}%. That's ${data.votes} crucial electoral votes. #ElectionNight`,
      `PROJECTION: ${data.winner} wins ${data.state} by ${data.margin} points. ${data.votes} electoral votes added to the tally. #Breaking`
    ],
    bbcAnalysis: [
      `BBC Analysis: ${data.state} showing early signs of shifting. Current margin under ${data.margin}% with ${data.reporting}% reporting. #ElectionWatch`,
      `Our projections show ${data.leader} favored to win ${data.state}, but margin narrowing. Key counties still counting. #BBCElection`,
      `${data.state} remains too close to call. ${data.leader} leads by just ${data.margin}% with major precincts outstanding. #ElectionUpdate`
    ],
    userOpinion: [
      `Come on ${data.preferred}! We need those ${data.state} votes! 🗳️ #Election2024`,
      `Watching ${data.state} closely... hoping ${data.preferred} can pull through! The tension is real! #ElectionNight`,
      `If ${data.preferred} wins ${data.state}, that's huge for the path to 270! 🇺🇸 #ElectionWatch`
    ],
    default: [
      `${data.state} called for ${data.winner}. ${data.votes} EVs. #ElectionNight`
    ]
  };
  const list = templates[type] || templates.default;
  return list[Math.floor(Math.random() * list.length)];
};

/* -------------------------
   Robust AI caller (safe)
   - Uses environment variables:
     NEXT_PUBLIC_OPENAI_API_KEY (Authorization: Bearer)
     NEXT_PUBLIC_ANTHROPIC_API_KEY (x-api-key)
   - Returns empty string on failure or when no key is configured
   ------------------------- */
async function callAI(prompt) {
  try {
    const openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    const anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY;

    if (openaiKey) {
      // Call OpenAI chat completion endpoint (client-side; not recommended for production)
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150,
          temperature: 0.8
        })
      });
      if (!res.ok) {
        console.warn("OpenAI call failed:", res.status, await res.text());
        return "";
      }
      const json = await res.json();
      // Try common shapes
      const text =
        json?.choices?.[0]?.message?.content ??
        json?.choices?.[0]?.text ??
        json?.output ??
        "";
      return typeof text === "string" ? text.trim() : "";
    } else if (anthropicKey) {
      // Call Anthropic (client-side; also not recommended for production)
      const res = await fetch("https://api.anthropic.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 150
        })
      });
      if (!res.ok) {
        console.warn("Anthropic call failed:", res.status, await res.text());
        return "";
      }
      const json = await res.json();
      // Try common shapes
      let text = "";
      if (typeof json?.completion === "string") text = json.completion;
      if (!text) text = json?.content?.[0]?.text ?? json?.choices?.[0]?.message?.content ?? json?.output?.[0]?.content ?? "";
      return typeof text === "string" ? text.trim() : "";
    } else {
      // No API key configured
      return "";
    }
  } catch (err) {
    console.error("callAI error:", err);
    return "";
  }
}

/* -------------------------
   Main component
   ------------------------- */
const ElectionBroadcast = () => {
  const totalElectoralVotes = 538;
  const votesToWin = 270;

  const [states] = useState(STATES);
  const [candidates, setCandidates] = useState([
    { id: "c1", name: "Alex Morgan", shortName: "Morgan", party: "Democrat", color: "#2563EB", votes: 0, displayVotes: 0, popularVote: 0 },
    { id: "c2", name: "Taylor Reed", shortName: "Reed", party: "Republican", color: "#DC2626", votes: 0, displayVotes: 0, popularVote: 0 }
  ]);

  const [stateResults, setStateResults] = useState({}); // code -> result
  const [recentCalls, setRecentCalls] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [breakingNews, setBreakingNews] = useState([
    "First exit polls expected within the hour from key swing states",
    "Both campaigns confident as final votes are cast",
    "High turnout reported in major cities"
  ]);

  const [showStateModal, setShowStateModal] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [tempStateResult, setTempStateResult] = useState({ winner: null, percentage: 50, margin: 0 });
  const [showStateAnnouncement, setShowStateAnnouncement] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const [aiEnabled, setAIEnabled] = useState(true);

  const [isLoadingSimulation, setIsLoadingSimulation] = useState(false);

  const liveIntervalRef = useRef(null);

  const statesCalled = Object.keys(stateResults).length;
  const totalStates = states.length;

  useEffect(() => {
    return () => {
      if (liveIntervalRef.current) {
        clearInterval(liveIntervalRef.current);
      }
    };
  }, []);

  /* -------------------------
     Social post generation
     - Uses callAI helper and falls back to templates
     ------------------------- */
  const generateSocialPost = async (state, winner, percentage, margin, postType = "stateCalled") => {
    setIsGeneratingPost(true);

    if (!aiEnabled) {
      // Non-AI path
      let tweet = "";
      switch (postType) {
        case "stateCalled":
          tweet = getNonAITweet("stateCalled", {
            state: state.name,
            winner: winner.shortName,
            percentage,
            margin,
            votes: state.votes
          });
          break;
        case "bbcAnalysis": {
          const leader = candidates[0].votes > candidates[1].votes ? candidates[0] : candidates[1];
          tweet = getNonAITweet("bbcAnalysis", {
            state: state.name,
            leader: leader.shortName,
            margin: Math.abs(percentage - 50).toFixed(1),
            reporting: Math.round(state.reporting)
          });
          break;
        }
        case "userOpinion":
          tweet = getNonAITweet("userOpinion", { preferred: winner.shortName, state: state.name });
          break;
        default:
          tweet = getNonAITweet("default", {
            state: state.name,
            winner: winner.shortName,
            votes: state.votes
          });
      }

      setSocialPosts(prev => [{
        id: Date.now(),
        text: tweet,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        likes: Math.floor(Math.random() * 50000) + 10000,
        retweets: Math.floor(Math.random() * 20000) + 5000,
        source: "@ElectionCentral",
        verified: postType !== "userOpinion"
      }, ...prev].slice(0, 8));
      setIsGeneratingPost(false);
      return;
    }

    // AI path (robust)
    try {
      let prompt = "";
      if (postType === "stateCalled") {
        prompt = `You are a CNN political correspondent on Twitter. Generate a SHORT, exciting tweet (max 280 chars) about this election update: ${state.name} has been called for ${winner.name} (${winner.party}) with ${percentage}% of the vote, winning by ${margin}% margin. ${state.votes} electoral votes. Make it sound like breaking news, professional but engaging. Include relevant hashtags. DO NOT use quotation marks in your response. Just write the tweet directly.`;
      } else if (postType === "bbcAnalysis") {
        const leader = candidates[0].votes > candidates[1].votes ? candidates[0] : candidates[1];
        prompt = `You are a BBC political analyst on Twitter. Write a SHORT analytical tweet (max 280 chars) about ${state.name} potentially shifting or being competitive. ${leader.name} currently leads overall. Make it sound authoritative and analytical. Include #BBCElection. DO NOT use quotation marks.`;
      } else if (postType === "userOpinion") {
        const preferred = [candidates[0], candidates[1]][Math.floor(Math.random() * 2)];
        prompt = `You are a regular Twitter user watching election night. Write a SHORT, emotional tweet (max 280 chars) hoping ${preferred.name} wins ${state.name}. Be casual, use emojis, show excitement or anxiety. Make it feel authentic. DO NOT use quotation marks.`;
      } else {
        prompt = `Write a SHORT tweet (max 280 chars) summarizing: ${state.name} just called for ${winner.name}.`;
      }

      const aiText = await callAI(prompt);
      const tweet = aiText || getNonAITweet(postType, {
        state: state.name,
        winner: winner.shortName ?? winner.name,
        percentage,
        margin,
        votes: state.votes,
        leader: (candidates[0].votes > candidates[1].votes ? candidates[0].shortName : candidates[1].shortName),
        preferred: winner.shortName ?? winner.name,
        reporting: Math.round(state.reporting)
      });

      const source = postType === "bbcAnalysis" ? "@BBCBreaking" :
        postType === "userOpinion" ? `@${userNames[Math.floor(Math.random() * userNames.length)]}` :
          "@ElectionCentral";

      setSocialPosts(prev => [{
        id: Date.now(),
        text: tweet,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        likes: Math.floor(Math.random() * 50000) + 10000,
        retweets: Math.floor(Math.random() * 20000) + 5000,
        source,
        verified: postType !== "userOpinion"
      }, ...prev].slice(0, 8));
    } catch (err) {
      console.error("generateSocialPost error:", err);
      // fallback
      const tweet = getNonAITweet("stateCalled", {
        state: state.name,
        winner: winner.shortName ?? winner.name,
        percentage,
        margin,
        votes: state.votes
      });
      setSocialPosts(prev => [{
        id: Date.now(),
        text: tweet,
        time: new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
        likes: Math.floor(Math.random() * 50000) + 10000,
        retweets: Math.floor(Math.random() * 20000) + 5000,
        source: "@ElectionCentral",
        verified: true
      }, ...prev].slice(0, 8));
    } finally {
      setIsGeneratingPost(false);
    }
  };

  /* -------------------------
     Simulate a single state result (temp)
     - picks random winner and percentage
     ------------------------- */
  const simulateStateResult = () => {
    if (!selectedState) return;
    const winBy = 50 + Math.floor(Math.random() * 40); // 50-89
    const winnerIdx = Math.random() > 0.5 ? 0 : 1;
    const winner = candidates[winnerIdx];
    const percentage = winBy;
    const margin = (percentage - 50).toFixed(1);
    setTempStateResult({
      winner,
      percentage,
      margin: parseFloat(margin),
      state: selectedState
    });
  };

  /* -------------------------
     Confirm a state call and apply
     ------------------------- */
  const confirmStateResult = async () => {
    if (!tempStateResult.winner || !selectedState) {
      setShowStateModal(false);
      return;
    }
    const state = selectedState;
    const winner = tempStateResult.winner;
    const margin = Number(tempStateResult.margin) || Math.abs(tempStateResult.percentage - 50);
    const percentage = tempStateResult.percentage || (50 + Math.round(margin));

    // Apply to stateResults
    setStateResults(prev => {
      const copy = { ...prev };
      copy[state.code] = {
        winnerId: winner.id,
        winnerShort: winner.shortName,
        percentage,
        margin,
        votes: state.votes,
        state
      };
      return copy;
    });

    // Update candidate totals
    setCandidates(prev => {
      return prev.map(c => {
        if (c.id === winner.id) {
          return {
            ...c,
            votes: c.votes + state.votes,
            displayVotes: c.displayVotes + state.votes,
            popularVote: c.popularVote + Math.floor(Math.random() * 1000000)
          };
        }
        return c;
      });
    });

    // Recent calls
    setRecentCalls(prev => [{
      id: Date.now(),
      state: state.name,
      winner: winner.shortName,
      votes: state.votes,
      margin
    }, ...prev].slice(0, 8));

    // Show announcement overlay briefly
    setShowStateAnnouncement({
      state,
      winner,
      margin: parseFloat(margin)
    });
    setTimeout(() => setShowStateAnnouncement(false), 3000);

    // Generate social posts (AI or non-AI)
    generateSocialPost(state, winner, percentage, margin, "stateCalled");
    generateSocialPost(state, winner, percentage, margin, "bbcAnalysis");
    generateSocialPost(state, winner, percentage, margin, "userOpinion");

    // close modal
    setShowStateModal(false);
    setSelectedState(null);
    setTempStateResult({ winner: null, percentage: 50, margin: 0 });
  };

  /* -------------------------
     Start a simple live simulation that calls random states periodically
     ------------------------- */
  const startLiveSimulation = () => {
    if (isLive) return;
    setIsLive(true);
    setIsLoadingSimulation(true);

    let remaining = states.filter(s => !stateResults[s.code]);
    if (remaining.length === 0) {
      remaining = [...states];
      setStateResults({});
      setCandidates(prev => prev.map(c => ({ ...c, votes: 0, displayVotes: 0, popularVote: 0 })));
      setRecentCalls([]);
      setSocialPosts([]);
    }

    // Pulse: every 2-3 seconds call a state (short for demo)
    liveIntervalRef.current = setInterval(() => {
      const notCalled = states.filter(s => !stateResults[s.code]);
      if (notCalled.length === 0) {
        clearInterval(liveIntervalRef.current);
        liveIntervalRef.current = null;
        setIsLive(false);
        setIsLoadingSimulation(false);
        return;
      }
      const pick = notCalled[Math.floor(Math.random() * notCalled.length)];
      setSelectedState(pick);
      // decide winner
      const winnerIdx = Math.random() > 0.5 ? 0 : 1;
      const winner = candidates[winnerIdx];
      const percentage = 50 + Math.floor(Math.random() * 40);
      const margin = (percentage - 50).toFixed(1);

      // apply call synchronously to simulate live
      setStateResults(prev => {
        const copy = { ...prev };
        copy[pick.code] = {
          winnerId: winner.id,
          winnerShort: winner.shortName,
          percentage,
          margin: parseFloat(margin),
          votes: pick.votes,
          state: pick
        };
        return copy;
      });
      setCandidates(prev => {
        return prev.map(c => {
          if (c.id === winner.id) {
            return {
              ...c,
              votes: c.votes + pick.votes,
              displayVotes: c.displayVotes + pick.votes,
              popularVote: c.popularVote + Math.floor(Math.random() * 1000000)
            };
          }
          return c;
        });
      });
      setRecentCalls(prev => [{
        id: Date.now(),
        state: pick.name,
        winner: winner.shortName,
        votes: pick.votes,
        margin: parseFloat(margin)
      }, ...prev].slice(0, 8));
      // generate social
      generateSocialPost(pick, winner, percentage, parseFloat(margin), "stateCalled");
    }, 2200);

    // allow a brief loading state before first call
    setTimeout(() => setIsLoadingSimulation(false), 900);
  };

  /* -------------------------
     UI helpers
     ------------------------- */
  const openStateModal = (s) => {
    setSelectedState(s);
    setShowStateModal(true);
    setTempStateResult({ winner: null, percentage: 50, margin: 0 });
  };

  /* -------------------------
     Render
     ------------------------- */
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* State Announcement Overlay */}
      {showStateAnnouncement && showStateAnnouncement.winner && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div
            className="animate-zoomIn"
            style={{
              animation: "zoomIn 0.5s ease-out, float 3s ease-in-out 0.5s",
              transformStyle: "preserve-3d",
              transform: "perspective(1000px) rotateX(15deg)"
            }}
          >
            <div className="bg-gradient-to-b from-gray-900/80 to-black/60 p-6 rounded-3xl backdrop-blur-xl border border-gray-700 shadow-2xl text-center">
              <div className="text-2xl text-gray-400">STATE CALLED</div>
              <div className="text-5xl font-bold mb-4 text-white">
                {showStateAnnouncement.winner.shortName}
              </div>
              <div className="flex justify-center gap-8 text-2xl">
                <div className="bg-black/50 px-6 py-3 rounded-lg">
                  <div className="text-gray-400">MARGIN</div>
                  <div className="font-bold text-yellow-400">{showStateAnnouncement.margin.toFixed(1)}%</div>
                </div>
                <div className="bg-black/50 px-6 py-3 rounded-lg">
                  <div className="text-gray-400">ELECTORAL</div>
                  <div className="font-bold text-yellow-400">{showStateAnnouncement.state.votes} VOTES</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Navigation */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b-4 border-red-600 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-bold">Election Broadcast Ultimate</div>
          <div className="text-sm text-gray-300">Live simulation demo</div>
        </div>
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={aiEnabled} onChange={() => setAIEnabled(prev => !prev)} />
            AI Posts
          </label>
          <button
            onClick={startLiveSimulation}
            disabled={isLive}
            className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 rounded-lg font-semibold hover:scale-105 transition-transform disabled:opacity-50 flex items-center gap-2"
          >
            <Globe className="w-4 h-4" />
            {isLive ? "SIMULATION IN PROGRESS..." : "START LIVE SIMULATION"}
          </button>
          <button
            onClick={() => {
              setStateResults({});
              setRecentCalls([]);
              setSocialPosts([]);
              setCandidates(prev => prev.map(c => ({ ...c, votes: 0, displayVotes: 0, popularVote: 0 })));
              setIsLive(false);
              if (liveIntervalRef.current) {
                clearInterval(liveIntervalRef.current);
                liveIntervalRef.current = null;
              }
            }}
            className="px-4 py-2 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main grid */}
      <div className="p-6 grid grid-cols-12 gap-6">
        {/* Left column: Candidate tallies + state list */}
        <div className="col-span-4 space-y-4">
          {/* Candidate cards */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xl font-semibold">Electoral Tally</div>
              <div className="text-sm text-gray-400">{candidates[0].votes} - {candidates[1].votes}</div>
            </div>
            <div className="space-y-3">
              {candidates.map((c) => (
                <div key={c.id} className="flex items-center justify-between bg-gray-900/40 p-3 rounded-lg border border-gray-700/40">
                  <div>
                    <div className="font-bold">{c.shortName}</div>
                    <div className="text-xs text-gray-400">{c.party}</div>
                  </div>
                  <div className="text-2xl font-bold">{c.votes}</div>
                </div>
              ))}
            </div>
          </div>

          {/* State list */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40 max-h-[60vh] overflow-y-auto">
            <div className="text-lg font-semibold mb-3">States</div>
            <div className="grid grid-cols-1 gap-2">
              {states.map(s => {
                const res = stateResults[s.code];
                return (
                  <button
                    key={s.code}
                    onClick={() => openStateModal(s)}
                    className={`flex items-center justify-between p-2 rounded-lg hover:bg-gray-700 transition-colors ${res ? 'bg-gray-700/40' : 'bg-gray-900/20'}`}
                  >
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-xs text-gray-400">{s.votes} EVs • {s.region}</div>
                    </div>
                    <div className="text-sm">
                      {res ? <span className="text-yellow-400 font-bold">{res.winnerShort}</span> : <span className="text-gray-400">Uncalled</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Center column: Map/status */}
        <div className="col-span-4">
          <div className="bg-gradient-to-b from-gray-800/30 to-gray-900/30 rounded-lg p-6 border border-gray-700/30">
            <div className="text-center mb-4">
              <div className="text-5xl font-bold mb-2">{votesToWin}</div>
              <div className="text-sm text-gray-400 uppercase tracking-wide">To Win</div>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div className="text-center p-4 rounded-lg bg-gray-900/40 w-1/2">
                <div className="text-4xl font-bold">{statesCalled}/{totalStates}</div>
                <div className="text-sm text-gray-400 uppercase">States Called</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-gray-900/40 w-1/2">
                <div className="text-4xl font-bold">{candidates[0].votes}</div>
                <div className="text-sm text-gray-400 uppercase">{candidates[0].shortName}</div>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  if (!selectedState) setSelectedState(states[Math.floor(Math.random() * states.length)]);
                  setShowStateModal(true);
                }}
                className="flex-1 px-4 py-3 bg-purple-600 rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                Call a State
              </button>
              <button
                onClick={() => {
                  const pick = states[Math.floor(Math.random() * states.length)];
                  openStateModal(pick);
                  setTimeout(simulateStateResult, 300);
                }}
                className="px-4 py-3 bg-gray-700 rounded-lg font-semibold hover:bg-gray-600 transition-colors"
              >
                Quick Sim
              </button>
            </div>
          </div>

          {/* Recent calls */}
          <div className="mt-4 bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
            <div className="flex justify-between items-center mb-3">
              <div className="font-semibold">Recent Calls</div>
              <div className="text-xs text-gray-400">{recentCalls.length} shown</div>
            </div>
            <div className="space-y-2">
              {recentCalls.length === 0 ? (
                <div className="text-gray-500 text-sm">No calls yet</div>
              ) : (
                recentCalls.map(rc => (
                  <div key={rc.id} className="flex items-center justify-between p-2 bg-gray-900/20 rounded">
                    <div>
                      <div className="font-semibold">{rc.state}</div>
                      <div className="text-xs text-gray-400">{rc.winner} • {rc.votes} EVs</div>
                    </div>
                    <div className="text-sm text-yellow-400">±{rc.margin}%</div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right column: Social + Ticker */}
        <div className="col-span-4 space-y-4">
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">
                Social Feed { !aiEnabled && <span className="text-xs bg-gray-700 px-2 py-1 rounded">NO AI</span> }
              </h3>
              <div className="text-sm text-gray-400">{socialPosts.length} posts</div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto">
              {socialPosts.length === 0 ? (
                <div className="text-gray-500 text-sm">No posts yet - states will be announced here</div>
              ) : (
                socialPosts.map((post) => (
                  <div key={post.id} className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50">
                    <div className="flex items-start gap-2">
                      <div className={`w-8 h-8 ${post.source === '@BBCBreaking' ? 'bg-red-600' : post.verified ? 'bg-blue-500' : 'bg-gray-600'} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                        {post.source === '@BBCBreaking' ? (
                          <Radio className="w-4 h-4 text-white" />
                        ) : post.verified ? (
                          <Tv className="w-4 h-4 text-white" />
                        ) : (
                          <User className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">{post.source}</span>
                          {post.verified && <span className="text-blue-400 text-xs">✓</span>}
                          <span className="text-xs text-gray-500">{post.time}</span>
                        </div>
                        <p className="text-sm text-gray-200 mb-2">{post.text}</p>
                        <div className="flex gap-4 text-xs text-gray-500">
                          <span>❤️ {(post.likes / 1000).toFixed(1)}K</span>
                          <span>🔁 {(post.retweets / 1000).toFixed(1)}K</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* News ticker */}
          <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 px-6 py-3 border-t border-red-600 rounded-lg">
            <div className="flex items-center gap-4">
              <span className="bg-red-600 px-3 py-1 rounded text-sm font-bold animate-pulse">BREAKING</span>
              <div className="flex-1 overflow-hidden">
                <div className="animate-scroll whitespace-nowrap">
                  {breakingNews.map((news, i) => (
                    <span key={i} className="mr-8">• {news}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/40 flex gap-3">
            <button
              onClick={() => {
                // simulate manual call of the currently selected state
                if (selectedState) {
                  simulateStateResult();
                } else {
                  const pick = states[Math.floor(Math.random() * states.length)];
                  openStateModal(pick);
                  setTimeout(simulateStateResult, 200);
                }
              }}
              className="flex-1 px-4 py-2 bg-purple-600 rounded-lg font-semibold"
            >
              Simulate Result
            </button>
            <button
              onClick={() => {
                // toggle AI posts on/off
                setAIEnabled(prev => !prev);
              }}
              className="px-4 py-2 bg-gray-700 rounded-lg"
            >
              {aiEnabled ? "Disable AI" : "Enable AI"}
            </button>
          </div>
        </div>
      </div>

      {/* State Selection / Call Modal */}
      {showStateModal && selectedState && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="text-xl font-bold mb-1">{selectedState.name}</div>
                <div className="text-sm text-gray-400 mb-3">{selectedState.votes} electoral votes • {selectedState.region}</div>
              </div>
              <button onClick={() => { setShowStateModal(false); setSelectedState(null); }} className="text-gray-400">Close</button>
            </div>

            <div className="mt-4">
              <div className="text-sm text-gray-300 mb-2">Choose winner</div>
              <div className="flex gap-2">
                {candidates.map(candidate => (
                  <button
                    key={candidate.id}
                    onClick={() => setTempStateResult(prev => ({ ...prev, winner: candidate }))}
                    className={`flex-1 px-3 py-2 rounded-lg ${tempStateResult.winner?.id === candidate.id ? 'ring-2 ring-offset-1 ring-purple-500' : 'bg-gray-900/20'}`}
                    style={{
                      background: tempStateResult.winner?.id === candidate.id ? `linear-gradient(135deg, ${candidate.color}40, ${candidate.color}20)` : undefined
                    }}
                  >
                    <div className="font-bold">{candidate.shortName}</div>
                    <div className="text-xs text-gray-400">{candidate.party}</div>
                  </button>
                ))}
              </div>

              {tempStateResult.winner && (
                <>
                  <div className="mt-4">
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      VOTE PERCENTAGE: {tempStateResult.percentage}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="90"
                      value={tempStateResult.percentage}
                      onChange={(e) => setTempStateResult(prev => ({ ...prev, percentage: Number(e.target.value), margin: (Number(e.target.value) - 50).toFixed(1) }))}
                      className="w-full"
                    />
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => { setShowStateModal(false); setSelectedState(null); }}
                      className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmStateResult}
                      disabled={!tempStateResult.winner}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg disabled:opacity-50"
                    >
                      Call State
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes zoomIn {
          from {
            opacity: 0;
            transform: perspective(1000px) rotateX(15deg) scale(0.5);
          }
          to {
            opacity: 1;
            transform: perspective(1000px) rotateX(15deg) scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: perspective(1000px) rotateX(15deg) translateY(0);
          }
          50% {
            transform: perspective(1000px) rotateX(15deg) translateY(-20px);
          }
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll {
          animation: scroll 40s linear infinite;
        }

        /* The previous bug: component used className="animate-zoomIn" but didn't define it.
           Add the helper class so it actually animates. */
        .animate-zoomIn {
          animation: zoomIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ElectionBroadcast;
