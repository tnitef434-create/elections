import React, { useState, useEffect, useRef } from 'react';
import { MapPin, TrendingUp, Users, BarChart3, AlertCircle, Clock, Activity, Globe, Tv, ChevronRight, Edit2, Twitter, Sparkles, Zap, User, Radio, ToggleLeft, ToggleRight } from 'lucide-react';

const ElectionBroadcast = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Joseph R. Biden', party: 'Democrat', shortName: 'BIDEN', color: '#0066CC', votes: 0, displayVotes: 0, popularVote: 0 },
    { id: 2, name: 'Donald J. Trump', party: 'Republican', shortName: 'TRUMP', color: '#DC3228', votes: 0, displayVotes: 0, popularVote: 0 }
  ]);
  
  const [aiEnabled, setAiEnabled] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [stateResults, setStateResults] = useState({});
  const [isLive, setIsLive] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showStateModal, setShowStateModal] = useState(false);
  const [tempStateResult, setTempStateResult] = useState({ winner: null, percentage: 50 });
  const [recentCalls, setRecentCalls] = useState([]);
  const [breakingNews, setBreakingNews] = useState([]);
  const [keyRaces, setKeyRaces] = useState([]);
  const [socialPosts, setSocialPosts] = useState([]);
  const [showStateAnnouncement, setShowStateAnnouncement] = useState(null);
  const [isGeneratingPost, setIsGeneratingPost] = useState(false);
  const animationRef = useRef();
  const newsTickerRef = useRef(0);
  
  // US States with electoral votes and regions
  const states = [
    { name: 'California', code: 'CA', votes: 54, region: 'West', reporting: 0 },
    { name: 'Texas', code: 'TX', votes: 40, region: 'South', reporting: 0 },
    { name: 'Florida', code: 'FL', votes: 30, region: 'South', reporting: 0 },
    { name: 'New York', code: 'NY', votes: 28, region: 'Northeast', reporting: 0 },
    { name: 'Pennsylvania', code: 'PA', votes: 19, region: 'Northeast', reporting: 0 },
    { name: 'Illinois', code: 'IL', votes: 19, region: 'Midwest', reporting: 0 },
    { name: 'Ohio', code: 'OH', votes: 17, region: 'Midwest', reporting: 0 },
    { name: 'Georgia', code: 'GA', votes: 16, region: 'South', reporting: 0 },
    { name: 'North Carolina', code: 'NC', votes: 16, region: 'South', reporting: 0 },
    { name: 'Michigan', code: 'MI', votes: 15, region: 'Midwest', reporting: 0 },
    { name: 'New Jersey', code: 'NJ', votes: 14, region: 'Northeast', reporting: 0 },
    { name: 'Virginia', code: 'VA', votes: 13, region: 'South', reporting: 0 },
    { name: 'Washington', code: 'WA', votes: 12, region: 'West', reporting: 0 },
    { name: 'Arizona', code: 'AZ', votes: 11, region: 'West', reporting: 0 },
    { name: 'Tennessee', code: 'TN', votes: 11, region: 'South', reporting: 0 },
    { name: 'Massachusetts', code: 'MA', votes: 11, region: 'Northeast', reporting: 0 },
    { name: 'Indiana', code: 'IN', votes: 11, region: 'Midwest', reporting: 0 },
    { name: 'Missouri', code: 'MO', votes: 10, region: 'Midwest', reporting: 0 },
    { name: 'Maryland', code: 'MD', votes: 10, region: 'South', reporting: 0 },
    { name: 'Wisconsin', code: 'WI', votes: 10, region: 'Midwest', reporting: 0 },
    { name: 'Colorado', code: 'CO', votes: 10, region: 'West', reporting: 0 },
    { name: 'Minnesota', code: 'MN', votes: 10, region: 'Midwest', reporting: 0 },
    { name: 'South Carolina', code: 'SC', votes: 9, region: 'South', reporting: 0 },
    { name: 'Alabama', code: 'AL', votes: 9, region: 'South', reporting: 0 },
    { name: 'Louisiana', code: 'LA', votes: 8, region: 'South', reporting: 0 },
    { name: 'Kentucky', code: 'KY', votes: 8, region: 'South', reporting: 0 },
    { name: 'Oregon', code: 'OR', votes: 8, region: 'West', reporting: 0 },
    { name: 'Oklahoma', code: 'OK', votes: 7, region: 'South', reporting: 0 },
    { name: 'Connecticut', code: 'CT', votes: 7, region: 'Northeast', reporting: 0 },
    { name: 'Utah', code: 'UT', votes: 6, region: 'West', reporting: 0 },
    { name: 'Iowa', code: 'IA', votes: 6, region: 'Midwest', reporting: 0 },
    { name: 'Nevada', code: 'NV', votes: 6, region: 'West', reporting: 0 },
    { name: 'Arkansas', code: 'AR', votes: 6, region: 'South', reporting: 0 },
    { name: 'Mississippi', code: 'MS', votes: 6, region: 'South', reporting: 0 },
    { name: 'Kansas', code: 'KS', votes: 6, region: 'Midwest', reporting: 0 },
    { name: 'New Mexico', code: 'NM', votes: 5, region: 'West', reporting: 0 },
    { name: 'Nebraska', code: 'NE', votes: 5, region: 'Midwest', reporting: 0 },
    { name: 'Idaho', code: 'ID', votes: 4, region: 'West', reporting: 0 },
    { name: 'West Virginia', code: 'WV', votes: 4, region: 'South', reporting: 0 },
    { name: 'Hawaii', code: 'HI', votes: 4, region: 'West', reporting: 0 },
    { name: 'New Hampshire', code: 'NH', votes: 4, region: 'Northeast', reporting: 0 },
    { name: 'Maine', code: 'ME', votes: 4, region: 'Northeast', reporting: 0 },
    { name: 'Rhode Island', code: 'RI', votes: 4, region: 'Northeast', reporting: 0 },
    { name: 'Montana', code: 'MT', votes: 4, region: 'West', reporting: 0 },
    { name: 'Delaware', code: 'DE', votes: 3, region: 'South', reporting: 0 },
    { name: 'South Dakota', code: 'SD', votes: 3, region: 'Midwest', reporting: 0 },
    { name: 'North Dakota', code: 'ND', votes: 3, region: 'Midwest', reporting: 0 },
    { name: 'Alaska', code: 'AK', votes: 3, region: 'West', reporting: 0 },
    { name: 'Vermont', code: 'VT', votes: 3, region: 'Northeast', reporting: 0 },
    { name: 'Wyoming', code: 'WY', votes: 3, region: 'West', reporting: 0 },
    { name: 'District of Columbia', code: 'DC', votes: 3, region: 'South', reporting: 0 }
  ];

  const battlegroundStates = ['PA', 'GA', 'AZ', 'WI', 'MI', 'NV', 'NC'];

  const userNames = [
    'PoliticalJunkie', 'VoterMom2024', 'SwingStateWatch', 'ElectionNerd', 'CivicDuty', 
    'DemocracyFan', 'RedStateBlue', 'PurpleAmerica', 'IndependentVoice', 'YouthVote2024'
  ];

  // Non-AI tweet templates
  const getNonAITweet = (type, data) => {
    const templates = {
      stateCalled: [
        `BREAKING: ${data.state} called for ${data.winner} with ${data.percentage}% of the vote! ${data.votes} electoral votes secured. #Election2024`,
        `${data.state} goes to ${data.winner}! Victory margin: ${data.margin}%. That's ${data.votes} crucial electoral votes. #ElectionNight`,
        `PROJECTION: ${data.winner} wins ${data.state} by ${data.margin} points. ${data.votes} electoral votes added to the tally. #Breaking`,
      ],
      bbcAnalysis: [
        `BBC Analysis: ${data.state} showing early signs of shifting. Current margin under ${data.margin}% with ${data.reporting}% reporting. #ElectionWatch`,
        `Our projections show ${data.leader} favored to win ${data.state}, but margin narrowing. Key counties still counting. #BBCElection`,
        `${data.state} remains too close to call. ${data.leader} leads by just ${data.margin}% with major precincts outstanding. #ElectionUpdate`,
      ],
      userOpinion: [
        `Come on ${data.preferred}! We need those ${data.state} votes! 🗳️ #Election2024`,
        `Watching ${data.state} closely... hoping ${data.preferred} can pull through! The tension is real! #ElectionNight`,
        `If ${data.preferred} wins ${data.state}, that's huge for the path to 270! 🇺🇸 #ElectionWatch`,
        `My prediction: ${data.preferred} takes ${data.state} by ${3 + Math.floor(Math.random() * 5)}%. Mark my words! #Election2024`,
      ],
      momentum: [
        `${data.leader} building momentum with ${data.votes} electoral votes! ${270 - data.votes} to go! #RaceFor270`,
        `The map is shifting! ${data.leader} now at ${data.votes} electoral votes. Path to victory becoming clearer. #ElectionNight`,
        `ELECTORAL UPDATE: ${data.leader} - ${data.votes}, ${data.trailer} - ${data.trailVotes}. Every state counts now! #Election2024`,
      ]
    };
    
    const templateList = templates[type];
    return templateList[Math.floor(Math.random() * templateList.length)];
  };

  // Generate social media post
  const generateSocialPost = async (state, winner, percentage, margin, postType = 'stateCalled') => {
    setIsGeneratingPost(true);
    
    if (!aiEnabled) {
      // Non-AI post generation
      let tweet = '';
      const loser = candidates.find(c => c.id !== winner.id);
      
      switch(postType) {
        case 'stateCalled':
          tweet = getNonAITweet('stateCalled', {
            state: state.name,
            winner: winner.shortName,
            percentage,
            margin,
            votes: state.votes
          });
          break;
        case 'bbcAnalysis':
          const leader = candidates[0].votes > candidates[1].votes ? candidates[0] : candidates[1];
          tweet = getNonAITweet('bbcAnalysis', {
            state: state.name,
            leader: leader.shortName,
            margin: Math.abs(percentage - 50).toFixed(1),
            reporting: 75 + Math.floor(Math.random() * 25)
          });
          break;
        case 'userOpinion':
          const preferred = candidates[Math.floor(Math.random() * 2)];
          tweet = getNonAITweet('userOpinion', {
            preferred: preferred.shortName,
            state: state.name
          });
          break;
      }
      
      const source = postType === 'bbcAnalysis' ? '@BBCBreaking' : 
                    postType === 'userOpinion' ? `@${userNames[Math.floor(Math.random() * userNames.length)]}` : 
                    '@ElectionCentral';
      
      setSocialPosts(prev => [{
        id: Date.now(),
        text: tweet,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        likes: Math.floor(Math.random() * 50000) + 10000,
        retweets: Math.floor(Math.random() * 20000) + 5000,
        source: source,
        verified: postType !== 'userOpinion'
      }, ...prev].slice(0, 8));
      
      setIsGeneratingPost(false);
      return;
    }
    
    // AI-powered post generation
    try {
      let prompt = '';
      if (postType === 'stateCalled') {
        prompt = `You are a CNN political correspondent on Twitter. Generate a SHORT, exciting tweet (max 280 chars) about this election update: ${state.name} has been called for ${winner.name} (${winner.party}) with ${percentage}% of the vote, winning by ${margin}% margin. ${state.votes} electoral votes. Make it sound like breaking news, professional but engaging. Include relevant hashtags. DO NOT use quotation marks in your response. Just write the tweet directly.`;
      } else if (postType === 'bbcAnalysis') {
        const leader = candidates[0].votes > candidates[1].votes ? candidates[0] : candidates[1];
        prompt = `You are a BBC political analyst on Twitter. Write a SHORT analytical tweet (max 280 chars) about ${state.name} potentially shifting or being competitive. ${leader.name} currently leads overall. Make it sound authoritative and analytical. Include #BBCElection. DO NOT use quotation marks.`;
      } else if (postType === 'userOpinion') {
        const preferred = candidates[Math.floor(Math.random() * 2)];
        prompt = `You are a regular Twitter user watching election night. Write a SHORT, emotional tweet (max 280 chars) hoping ${preferred.name} wins ${state.name}. Be casual, use emojis, show excitement or anxiety. Make it feel authentic. DO NOT use quotation marks.`;
      }
      
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 150,
          messages: [{ role: "user", content: prompt }]
        })
      });
      
      const data = await response.json();
      const tweet = data.content[0].text;
      
      const source = postType === 'bbcAnalysis' ? '@BBCBreaking' : 
                    postType === 'userOpinion' ? `@${userNames[Math.floor(Math.random() * userNames.length)]}` : 
                    '@ElectionCentral';
      
      setSocialPosts(prev => [{
        id: Date.now(),
        text: tweet,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        likes: Math.floor(Math.random() * 50000) + 10000,
        retweets: Math.floor(Math.random() * 20000) + 5000,
        source: source,
        verified: postType !== 'userOpinion'
      }, ...prev].slice(0, 8));
    } catch (error) {
      // Fallback to non-AI if API fails
      generateSocialPost(state, winner, percentage, margin, postType);
    }
    setIsGeneratingPost(false);
  };

  // Generate BBC analysis posts periodically
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const uncalledBattleground = battlegroundStates.filter(code => !stateResults[code]);
      if (uncalledBattleground.length > 0) {
        const randomState = states.find(s => s.code === uncalledBattleground[Math.floor(Math.random() * uncalledBattleground.length)]);
        if (randomState) {
          const leader = candidates[Math.random() < 0.5 ? 0 : 1];
          generateSocialPost(randomState, leader, 51, 2, 'bbcAnalysis');
        }
      }
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(interval);
  }, [isLive, stateResults, candidates]);

  // Generate random user opinions
  useEffect(() => {
    if (!isLive) return;
    
    const interval = setInterval(() => {
      const randomState = states[Math.floor(Math.random() * states.length)];
      const preferred = candidates[Math.floor(Math.random() * 2)];
      generateSocialPost(randomState, preferred, 0, 0, 'userOpinion');
    }, 10000); // Every 10 seconds
    
    return () => clearInterval(interval);
  }, [isLive, candidates]);

  // Dynamic breaking news (non-AI)
  useEffect(() => {
    const updateBreakingNews = () => {
      const news = [];
      const totalCalled = Object.keys(stateResults).length;
      const leader = candidates[0].votes > candidates[1].votes ? candidates[0] : candidates[1];
      const trailer = candidates[0].votes > candidates[1].votes ? candidates[1] : candidates[0];
      const gap = Math.abs(candidates[0].votes - candidates[1].votes);
      
      if (totalCalled === 0) {
        news.push("Polls now open across the Eastern seaboard as Election Day begins");
        news.push("Record 75 million early votes already cast nationwide");
        news.push("First exit polls expected within the hour from key swing states");
        news.push("Both campaigns confident as final votes are cast");
      } else if (totalCalled < 10) {
        news.push(`${totalCalled} states called: ${leader.shortName} ${leader.votes}, ${trailer.shortName} ${trailer.votes}`);
        news.push(`Early results showing tight races in Pennsylvania, Georgia, and Arizona`);
        news.push(`Urban counties in swing states reporting high turnout`);
        news.push(`${leader.shortName} currently leading by ${gap} electoral votes`);
      } else if (totalCalled < 25) {
        news.push(`ELECTORAL COUNT: ${leader.shortName} ${leader.votes} - ${trailer.shortName} ${trailer.votes}`);
        news.push(`${25 - totalCalled} states still too close to call including key battlegrounds`);
        news.push(`Midwest becoming crucial with Wisconsin and Michigan results pending`);
        news.push(`Path to 270: ${leader.shortName} needs ${270 - leader.votes} more electoral votes`);
      } else if (totalCalled < 40) {
        news.push(`${leader.shortName} leads with ${leader.votes} electoral votes, ${270 - leader.votes} needed for victory`);
        news.push(`West Coast results could determine the outcome tonight`);
        news.push(`${totalCalled} of 51 races called, battleground states remain split`);
        news.push(`Historic voter turnout exceeds 160 million votes nationwide`);
      } else {
        news.push(`NEAR FINAL: ${leader.shortName} ${leader.votes} - ${trailer.shortName} ${trailer.votes}`);
        news.push(`Only ${51 - totalCalled} states remain uncalled as counting continues`);
        news.push(`${leader.shortName} closing in on 270 electoral votes needed to win`);
        news.push(`Networks preparing to make final projections`);
      }
      
      // Winner announcement
      if (candidates[0].votes >= 270 || candidates[1].votes >= 270) {
        const winner = candidates[0].votes >= 270 ? candidates[0] : candidates[1];
        news.unshift(`🚨 ${winner.name} WINS THE PRESIDENCY with ${winner.votes} electoral votes`);
        news.push(`President-elect ${winner.shortName} expected to speak shortly`);
        news.push(`World leaders congratulating ${winner.shortName} on historic victory`);
        news.push(`Transition team preparations begin immediately`);
      }
      
      setBreakingNews(news);
    };
    
    updateBreakingNews();
  }, [stateResults, candidates]);

  // Update key races dynamically with custom names
  useEffect(() => {
    const updateKeyRaces = () => {
      const races = battlegroundStates.map(code => {
        const state = states.find(s => s.code === code);
        const result = stateResults[code];
        let status = 'TOSS UP';
        let color = 'text-yellow-500';
        
        if (result) {
          const winner = candidates.find(c => c.id === result.winner);
          if (result.margin < 1) {
            status = 'TOO CLOSE';
            color = 'text-red-500';
          } else if (result.margin < 3) {
            status = 'LEAN ' + winner.shortName;
            color = winner.id === 1 ? 'text-blue-400' : 'text-red-400';
          } else {
            status = winner.shortName + ' LEADS';
            color = winner.id === 1 ? 'text-blue-500' : 'text-red-500';
          }
        } else if (Math.random() < 0.3) {
          // Random slight leans for uncalled states
          const leaningCandidate = candidates[Math.random() < 0.5 ? 0 : 1];
          status = `LEAN ${leaningCandidate.shortName}`;
          color = leaningCandidate.id === 1 ? 'text-blue-400' : 'text-red-400';
        }
        
        return { state, status, color };
      });
      
      setKeyRaces(races);
    };
    
    updateKeyRaces();
    const interval = setInterval(updateKeyRaces, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, [stateResults, candidates]);

  // Update clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Animate vote counting
  useEffect(() => {
    const animate = () => {
      setCandidates(prevCandidates => 
        prevCandidates.map(candidate => {
          if (candidate.displayVotes < candidate.votes) {
            const increment = Math.ceil((candidate.votes - candidate.displayVotes) / 8);
            return {
              ...candidate,
              displayVotes: Math.min(candidate.displayVotes + increment, candidate.votes)
            };
          }
          return candidate;
        })
      );
    };
    
    animationRef.current = setInterval(animate, 50);
    return () => clearInterval(animationRef.current);
  }, []);

  const handleStateClick = (state) => {
    setSelectedState(state);
    const existing = stateResults[state.code];
    if (existing) {
      setTempStateResult({ 
        winner: existing.winner, 
        percentage: existing.percentage,
        margin: existing.margin,
        reporting: existing.reporting || 0
      });
    } else {
      setTempStateResult({ winner: null, percentage: 50, margin: 0, reporting: 0 });
    }
    setShowStateModal(true);
  };

  const simulateStateResult = () => {
    if (!selectedState) return;
    
    // Simulate a realistic result
    const winner = candidates[Math.random() < 0.52 ? 0 : 1];
    const percentage = 48 + Math.floor(Math.random() * 7); // 48-55%
    const reporting = 85 + Math.floor(Math.random() * 15); // 85-100%
    
    setTempStateResult({
      winner: winner.id,
      percentage: percentage,
      reporting: reporting
    });
  };

  const confirmStateResult = async () => {
    if (!selectedState || !tempStateResult.winner) return;
    
    const winnerCandidate = candidates.find(c => c.id === tempStateResult.winner);
    const otherCandidate = candidates.find(c => c.id !== tempStateResult.winner);
    const winnerPercentage = tempStateResult.percentage;
    const loserPercentage = 100 - winnerPercentage;
    const margin = winnerPercentage - loserPercentage;
    
    // Show epic 3D announcement
    setShowStateAnnouncement({
      state: selectedState,
      winner: winnerCandidate,
      percentage: winnerPercentage,
      margin: Math.abs(margin)
    });
    
    setTimeout(() => setShowStateAnnouncement(null), 5000);
    
    // Update state results
    setStateResults(prev => ({
      ...prev,
      [selectedState.code]: {
        winner: tempStateResult.winner,
        percentage: winnerPercentage,
        loserPercentage: loserPercentage,
        margin: Math.abs(margin),
        reporting: tempStateResult.reporting || 100,
        timestamp: new Date()
      }
    }));
    
    // Add to recent calls
    setRecentCalls(prev => [{
      state: selectedState,
      winner: winnerCandidate,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }, ...prev].slice(0, 5));
    
    // Generate social media post
    await generateSocialPost(selectedState, winnerCandidate, winnerPercentage, Math.abs(margin), 'stateCalled');
    
    // Recalculate electoral votes
    recalculateVotes({ 
      ...stateResults, 
      [selectedState.code]: { winner: tempStateResult.winner }
    });
    
    setShowStateModal(false);
  };

  const recalculateVotes = (newStateResults) => {
    const voteCounts = {};
    const popularVotes = {};
    candidates.forEach(c => {
      voteCounts[c.id] = 0;
      popularVotes[c.id] = 0;
    });
    
    Object.entries(newStateResults).forEach(([stateCode, result]) => {
      const state = states.find(s => s.code === stateCode);
      if (state && result.winner) {
        voteCounts[result.winner] += state.votes;
        // Simulate popular vote (millions)
        popularVotes[result.winner] += Math.floor(Math.random() * 5 + 1);
      }
    });
    
    setCandidates(prevCandidates =>
      prevCandidates.map(candidate => ({
        ...candidate,
        votes: voteCounts[candidate.id] || 0,
        popularVote: popularVotes[candidate.id] || 0
      }))
    );
  };

  const startLiveSimulation = () => {
    setIsLive(true);
    setStateResults({});
    setRecentCalls([]);
    setSocialPosts([]);
    setCandidates(prev => prev.map(c => ({ ...c, votes: 0, displayVotes: 0, popularVote: 0 })));
    
    let stateIndex = 0;
    const shuffledStates = [...states].sort(() => Math.random() - 0.5);
    
    const interval = setInterval(() => {
      if (stateIndex >= shuffledStates.length) {
        clearInterval(interval);
        setIsLive(false);
        return;
      }
      
      const state = shuffledStates[stateIndex];
      const winner = candidates[Math.random() < 0.52 ? 0 : 1];
      const percentage = 50 + Math.floor(Math.random() * 20);
      const reporting = 75 + Math.floor(Math.random() * 25);
      
      // Show announcement for important states
      if (state.votes > 10 || battlegroundStates.includes(state.code)) {
        setShowStateAnnouncement({
          state: state,
          winner: winner,
          percentage: percentage,
          margin: Math.abs(percentage - (100 - percentage))
        });
        setTimeout(() => setShowStateAnnouncement(null), 4000);
      }
      
      setStateResults(prev => ({
        ...prev,
        [state.code]: {
          winner: winner.id,
          percentage: percentage,
          loserPercentage: 100 - percentage,
          margin: Math.abs(percentage - (100 - percentage)),
          reporting: reporting,
          timestamp: new Date()
        }
      }));
      
      setRecentCalls(prev => [{
        state: state,
        winner: winner,
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      }, ...prev].slice(0, 5));
      
      generateSocialPost(state, winner, percentage, Math.abs(percentage - (100 - percentage)), 'stateCalled');
      
      const newResults = { ...stateResults, [state.code]: { winner: winner.id }};
      recalculateVotes(newResults);
      stateIndex++;
    }, 6000); // Slower pace - 6 seconds per state
  };

  const getStateColor = (stateCode, opacity = 1) => {
    const result = stateResults[stateCode];
    if (!result) return `rgba(156, 163, 175, ${opacity * 0.3})`;
    const winner = candidates.find(c => c.id === result.winner);
    if (!winner) return `rgba(156, 163, 175, ${opacity * 0.3})`;
    
    // Adjust color intensity based on margin
    const marginIntensity = Math.min(result.margin / 30, 1);
    if (winner.id === 1) {
      return `rgba(0, 102, 204, ${opacity * (0.4 + marginIntensity * 0.6)})`;
    } else {
      return `rgba(220, 50, 40, ${opacity * (0.4 + marginIntensity * 0.6)})`;
    }
  };

  const totalElectoralVotes = 538;
  const votesToWin = 270;
  const statesCalled = Object.keys(stateResults).length;
  const totalStates = states.length;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans">
      {/* Epic 3D State Announcement Overlay */}
      {showStateAnnouncement && (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
          <div 
            className="animate-zoomIn"
            style={{
              animation: 'zoomIn 0.5s ease-out, float 3s ease-in-out 0.5s',
              transformStyle: 'preserve-3d',
              transform: 'perspective(1000px) rotateX(15deg)'
            }}
          >
            <div 
              className="bg-gradient-to-br from-gray-900 via-red-800 to-gray-900 p-8 rounded-2xl shadow-2xl border-4 border-yellow-500"
              style={{
                boxShadow: `0 20px 60px rgba(255, 215, 0, 0.6), 0 0 100px ${showStateAnnouncement.winner.color}`,
                background: `linear-gradient(135deg, ${showStateAnnouncement.winner.color}40, #111827, ${showStateAnnouncement.winner.color}40)`
              }}
            >
              <div className="text-center">
                <div className="text-yellow-400 text-2xl font-bold mb-2 animate-pulse">ELECTION ALERT</div>
                <div className="text-6xl font-bold mb-4" style={{ color: showStateAnnouncement.winner.color }}>
                  {showStateAnnouncement.state.name}
                </div>
                <div className="text-3xl font-semibold mb-2">CALLED FOR</div>
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
        </div>
      )}

      {/* Top Navigation Bar */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b-4 border-red-600">
        <div className="px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Tv className="w-8 h-8 text-red-600" />
              <span className="text-2xl font-bold">ELECTION</span>
              <span className="text-2xl font-light">CENTRAL</span>
            </div>
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1 rounded animate-pulse">
              <Activity className="w-4 h-4" />
              <span className="text-sm font-bold">LIVE</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setAiEnabled(!aiEnabled)}
              className={`px-3 py-1 ${aiEnabled ? 'bg-green-600' : 'bg-gray-600'} text-white rounded-full transition-colors flex items-center gap-2`}
            >
              {aiEnabled ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              <span className="text-sm">AI {aiEnabled ? 'ON' : 'OFF'}</span>
            </button>
            <button
              onClick={() => setEditMode(!editMode)}
              className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              {editMode ? 'Lock' : 'Edit'} Candidates
            </button>
            <Clock className="w-5 h-5" />
            <span className="text-lg font-mono">
              {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} ET
            </span>
          </div>
        </div>
      </div>

      {/* Main Electoral Display */}
      <div className="bg-gradient-to-b from-gray-800 to-gray-900 px-6 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-3 gap-8">
            {/* Democrat Column */}
            <div className="text-center">
              <div className="bg-blue-900/50 rounded-t-lg py-3 backdrop-blur-sm border border-blue-600/30">
                {editMode ? (
                  <div className="px-4 space-y-2">
                    <input
                      type="text"
                      value={candidates[0].name}
                      onChange={(e) => setCandidates(prev => prev.map((c, i) => i === 0 ? {...c, name: e.target.value} : c))}
                      className="w-full px-2 py-1 bg-blue-800/50 rounded text-white"
                      placeholder="Full name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={candidates[0].shortName}
                        onChange={(e) => setCandidates(prev => prev.map((c, i) => i === 0 ? {...c, shortName: e.target.value.toUpperCase()} : c))}
                        className="w-1/2 px-2 py-1 bg-blue-800/50 rounded text-white"
                        placeholder="SHORT"
                      />
                      <input
                        type="text"
                        value={candidates[0].party}
                        onChange={(e) => setCandidates(prev => prev.map((c, i) => i === 0 ? {...c, party: e.target.value} : c))}
                        className="w-1/2 px-2 py-1 bg-blue-800/50 rounded text-white"
                        placeholder="Party"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{candidates[0].shortName}</h3>
                    <p className="text-sm text-blue-200">{candidates[0].party}</p>
                  </>
                )}
              </div>
              <div className="bg-gradient-to-b from-blue-800/30 to-blue-900/30 rounded-b-lg p-6 backdrop-blur-sm border border-blue-600/30 border-t-0">
                <div className="text-6xl font-bold mb-2 text-blue-300 drop-shadow-2xl" 
                     style={{ textShadow: '0 4px 12px rgba(59, 130, 246, 0.5)' }}>
                  {candidates[0].displayVotes}
                </div>
                <div className="text-sm text-gray-300 mb-4">ELECTORAL VOTES</div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-700"
                    style={{ 
                      width: `${(candidates[0].displayVotes / votesToWin) * 100}%`,
                      boxShadow: '0 0 20px rgba(59, 130, 246, 0.7)'
                    }}
                  />
                </div>
                {candidates[0].popularVote > 0 && (
                  <div className="text-sm text-gray-400">
                    Popular: {candidates[0].popularVote.toLocaleString()}M
                  </div>
                )}
              </div>
            </div>

            {/* Center Status */}
            <div className="text-center">
              <div className="bg-gray-800/50 rounded-lg py-4 px-6 backdrop-blur-sm border border-gray-600/30 mb-4">
                <div className="text-5xl font-bold mb-2">{votesToWin}</div>
                <div className="text-sm text-gray-400 uppercase tracking-wide">To Win</div>
              </div>
              <div className="bg-gradient-to-b from-gray-700/30 to-gray-800/30 rounded-lg p-4 backdrop-blur-sm border border-gray-600/30">
                <div className="text-2xl font-semibold mb-2">{statesCalled}/{totalStates}</div>
                <div className="text-sm text-gray-400 uppercase">States Called</div>
                <div className="mt-4">
                  {candidates[0].votes >= votesToWin && (
                    <div className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                      {candidates[0].shortName} WINS
                    </div>
                  )}
                  {candidates[1].votes >= votesToWin && (
                    <div className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold animate-pulse">
                      {candidates[1].shortName} WINS
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Republican Column */}
            <div className="text-center">
              <div className="bg-red-900/50 rounded-t-lg py-3 backdrop-blur-sm border border-red-600/30">
                {editMode ? (
                  <div className="px-4 space-y-2">
                    <input
                      type="text"
                      value={candidates[1].name}
                      onChange={(e) => setCandidates(prev => prev.map((c, i) => i === 1 ? {...c, name: e.target.value} : c))}
                      className="w-full px-2 py-1 bg-red-800/50 rounded text-white"
                      placeholder="Full name"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={candidates[1].shortName}
                        onChange={(e) => setCandidates(prev => prev.map((c, i) => i === 1 ? {...c, shortName: e.target.value.toUpperCase()} : c))}
                        className="w-1/2 px-2 py-1 bg-red-800/50 rounded text-white"
                        placeholder="SHORT"
                      />
                      <input
                        type="text"
                        value={candidates[1].party}
                        onChange={(e) => setCandidates(prev => prev.map((c, i) => i === 1 ? {...c, party: e.target.value} : c))}
                        className="w-1/2 px-2 py-1 bg-red-800/50 rounded text-white"
                        placeholder="Party"
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h3 className="text-xl font-bold">{candidates[1].shortName}</h3>
                    <p className="text-sm text-red-200">{candidates[1].party}</p>
                  </>
                )}
              </div>
              <div className="bg-gradient-to-b from-red-800/30 to-red-900/30 rounded-b-lg p-6 backdrop-blur-sm border border-red-600/30 border-t-0">
                <div className="text-6xl font-bold mb-2 text-red-300 drop-shadow-2xl"
                     style={{ textShadow: '0 4px 12px rgba(220, 38, 38, 0.5)' }}>
                  {candidates[1].displayVotes}
                </div>
                <div className="text-sm text-gray-300 mb-4">ELECTORAL VOTES</div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden mb-4">
                  <div 
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-700"
                    style={{ 
                      width: `${(candidates[1].displayVotes / votesToWin) * 100}%`,
                      boxShadow: '0 0 20px rgba(220, 38, 38, 0.7)'
                    }}
                  />
                </div>
                {candidates[1].popularVote > 0 && (
                  <div className="text-sm text-gray-400">
                    Popular: {candidates[1].popularVote.toLocaleString()}M
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="bg-gray-800/50 backdrop-blur-sm px-6 py-4 border-y border-gray-700">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-4">
          <button
            onClick={startLiveSimulation}
            disabled={isLive}
            className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 transition-all flex items-center gap-2 font-semibold shadow-lg transform hover:scale-105"
          >
            <Globe className="w-5 h-5" />
            {isLive ? 'SIMULATION IN PROGRESS...' : 'START LIVE SIMULATION'}
          </button>
          <button
            onClick={() => {
              setStateResults({});
              setRecentCalls([]);
              setSocialPosts([]);
              setCandidates(prev => prev.map(c => ({ ...c, votes: 0, displayVotes: 0, popularVote: 0 })));
              setIsLive(false);
            }}
            className="px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition-all flex items-center gap-2 font-semibold shadow-lg"
          >
            <AlertCircle className="w-5 h-5" />
            RESET MAP
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* States Map Grid */}
        <div className="flex-1 p-6">
          <div className="bg-gray-800/30 rounded-lg p-6 backdrop-blur-sm border border-gray-700/50">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              ELECTORAL MAP - Click State to Set Results
            </h2>
            <div className="grid grid-cols-5 lg:grid-cols-7 gap-2">
              {states.sort((a, b) => b.votes - a.votes).map((state) => (
                <button
                  key={state.code}
                  onClick={() => handleStateClick(state)}
                  className="relative group"
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: 'perspective(1000px) rotateX(5deg)'
                  }}
                >
                  <div 
                    className="p-3 rounded-lg transition-all duration-300 border border-gray-600/50 hover:border-gray-400 transform hover:scale-110 hover:z-10 hover:shadow-2xl"
                    style={{
                      background: `linear-gradient(135deg, ${getStateColor(state.code, 1)}, ${getStateColor(state.code, 0.7)})`,
                      boxShadow: stateResults[state.code] 
                        ? `0 4px 20px ${getStateColor(state.code, 0.6)}, inset 0 1px 0 rgba(255,255,255,0.1)`
                        : 'inset 0 1px 0 rgba(255,255,255,0.1)'
                    }}
                  >
                    <div className="font-bold text-sm">{state.code}</div>
                    <div className="text-xs opacity-80">{state.votes} EV</div>
                    {stateResults[state.code] && (
                      <div className="text-xs mt-1 font-semibold">
                        {stateResults[state.code].percentage}%
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-96 p-6 bg-gray-800/30 border-l border-gray-700/50 overflow-y-auto">
          {/* Recent Calls */}
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-yellow-500" />
            RECENT CALLS
          </h3>
          <div className="space-y-3 mb-6">
            {recentCalls.length === 0 ? (
              <div className="text-gray-500 text-sm">No states called yet</div>
            ) : (
              recentCalls.map((call, index) => (
                <div 
                  key={index}
                  className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/50 backdrop-blur-sm animate-slideIn"
                  style={{ 
                    borderLeft: `4px solid ${call.winner.color}`,
                    animation: `slideIn 0.5s ease-out ${index * 0.1}s`
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{call.state.name}</div>
                      <div className="text-xs text-gray-400">{call.state.votes} Electoral Votes</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold" style={{ color: call.winner.color }}>
                        {call.winner.shortName}
                      </div>
                      <div className="text-xs text-gray-400">{call.time}</div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Key Races */}
          <div className="mb-6 pb-6 border-b border-gray-700">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              KEY BATTLEGROUND RACES
            </h3>
            <div className="space-y-2">
              {keyRaces.map(({ state, status, color }) => (
                <div key={state.code} className="flex justify-between items-center py-2 border-b border-gray-700/50">
                  <span className="text-sm">{state.name} ({state.votes})</span>
                  <span className={`text-sm font-semibold ${color} animate-pulse`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media Feed */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Twitter className="w-5 h-5 text-blue-400" />
              SOCIAL MEDIA FEED
              {isGeneratingPost && <Sparkles className="w-4 h-4 text-yellow-400 animate-spin" />}
              {!aiEnabled && <span className="text-xs bg-gray-700 px-2 py-1 rounded">NO AI</span>}
            </h3>
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
        </div>
      </div>

      {/* News Ticker */}
      <div className="bg-gradient-to-r from-gray-900 via-red-900 to-gray-900 px-6 py-3 border-t border-red-600">
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

      {/* State Selection Modal */}
      {showStateModal && selectedState && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-xl p-8 max-w-md w-full mx-4 border border-gray-700 shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-center">
              {selectedState.name} Results
            </h3>
            <div className="text-center mb-4 text-gray-400">
              {selectedState.votes} Electoral Votes
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-3 text-gray-300">SELECT WINNER</label>
                <div className="grid grid-cols-2 gap-4">
                  {candidates.map(candidate => (
                    <button
                      key={candidate.id}
                      onClick={() => setTempStateResult(prev => ({ ...prev, winner: candidate.id }))}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        tempStateResult.winner === candidate.id 
                          ? 'border-yellow-500 shadow-lg transform scale-105' 
                          : 'border-gray-600 hover:border-gray-400'
                      }`}
                      style={{
                        background: tempStateResult.winner === candidate.id 
                          ? `linear-gradient(135deg, ${candidate.color}40, ${candidate.color}20)`
                          : 'rgba(31, 41, 55, 0.5)'
                      }}
                    >
                      <div className="font-bold">{candidate.shortName}</div>
                      <div className="text-xs text-gray-400">{candidate.party}</div>
                    </button>
                  ))}
                </div>
                <button
                  onClick={simulateStateResult}
                  className="w-full mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  Simulate Result
                </button>
              </div>
              
              {tempStateResult.winner && (
                <>
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      VOTE PERCENTAGE: {tempStateResult.percentage}%
                    </label>
                    <input
                      type="range"
                      min="50"
                      max="90"
                      value={tempStateResult.percentage}
                      onChange={(e) => setTempStateResult(prev => ({ ...prev, percentage: parseInt(e.target.value) }))}
                      className="w-full"
                      style={{
                        background: `linear-gradient(to right, ${
                          candidates.find(c => c.id === tempStateResult.winner)?.color
                        } 0%, ${
                          candidates.find(c => c.id === tempStateResult.winner)?.color
                        } ${tempStateResult.percentage - 50}%, #4B5563 ${tempStateResult.percentage - 50}%, #4B5563 100%)`
                      }}
                    />
                    <div className="flex justify-between mt-2 text-sm text-gray-400">
                      <span>Close Race</span>
                      <span>Landslide</span>
                    </div>
                    <div className="mt-4 p-3 bg-gray-800/50 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">
                          {candidates.find(c => c.id === tempStateResult.winner)?.shortName}
                        </span>
                        <span className="font-bold">{tempStateResult.percentage}%</span>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-sm">
                          {candidates.find(c => c.id !== tempStateResult.winner)?.shortName}
                        </span>
                        <span className="font-bold">{100 - tempStateResult.percentage}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold mb-3 text-gray-300">
                      REPORTING: {tempStateResult.reporting || 100}%
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={tempStateResult.reporting || 100}
                      onChange={(e) => setTempStateResult(prev => ({ ...prev, reporting: parseInt(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowStateModal(false)}
                className="flex-1 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={confirmStateResult}
                disabled={!tempStateResult.winner}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 disabled:from-gray-600 disabled:to-gray-700 transition-all font-semibold shadow-lg"
              >
                Call State
              </button>
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
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-100%);
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
        
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ElectionBroadcast;