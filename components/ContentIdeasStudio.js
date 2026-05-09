'use client';

import { useState, useMemo } from 'react';

const NICHES = [
  'Fitness', 'Fashion', 'Finance', 'Food', 'Travel', 'Gaming', 'Beauty', 'Real Estate',
  'Tech', 'Crypto', 'Parenting', 'Pets', 'Comedy', 'Motivation', 'Education', 'Horror',
  'True Crime', 'Business', 'Spirituality', 'Health', 'Wellness', 'Yoga', 'Meditation',
  'Photography', 'Art', 'Music', 'Dance', 'Theater', 'Film', 'Writing', 'Poetry',
  'Science', 'Engineering', 'Architecture', 'Design', 'DIY', 'Crafts', 'Gardening',
  'Cooking', 'Baking', 'Mixology', 'Wine', 'Coffee', 'Tea', 'Sports', 'Soccer',
  'Basketball', 'Football', 'Tennis', 'Golf', 'Boxing', 'MMA', 'Running', 'Cycling',
  'Swimming', 'Surfing', 'Skateboarding', 'Snowboarding', 'Skiing', 'Hiking', 'Camping',
  'Fishing', 'Hunting', 'Travel Blogging', 'Digital Nomad', 'Luxury Travel', 'Budget Travel',
  'Solo Travel', 'Family Travel', 'Road Trip', 'Van Life', 'Entrepreneurship', 'Startup',
  'Venture Capital', 'E-commerce', 'Dropshipping', 'Affiliate Marketing', 'Social Media',
  'Influencer', 'Content Creator', 'YouTube', 'TikTok', 'Twitch', 'Podcasting', 'Blogging',
  'Copywriting', 'Marketing', 'Branding', 'SEO', 'Advertising', 'PR', 'Sales', 'Negotiation',
  'Investing', 'Stock Market', 'Real Estate Investing', 'NFTs', 'Web3', 'Metaverse',
  'AI', 'Machine Learning', 'Data Science', 'Programming', 'Web Dev', 'App Dev', 'Game Dev',
  'Cybersecurity', 'Cloud Computing', 'DevOps', 'Blockchain', 'VR', 'AR', 'Robotics',
  'Space', 'Astronomy', 'Physics', 'Chemistry', 'Biology', 'Psychology', 'Philosophy',
  'History', 'Geography', 'Politics', 'Economics', 'Sociology', 'Anthropology', 'Archaeology',
  'Languages', 'Linguistics', 'Translation', 'Culture', 'Traditions', 'Religion', 'Mythology',
  'Supernatural', 'Paranormal', 'Conspiracy', 'Mystery', 'Unsolved', 'Survival', 'Prepping',
  'Minimalism', 'Sustainability', 'Zero Waste', 'Eco Friendly', 'Climate Change', 'Nature',
  'Wildlife', 'Ocean', 'Forest', 'Mountains', 'Desert', 'Weather', 'Disasters', 'Anime',
  'Manga', 'Comics', 'Superheroes', 'Fantasy', 'Sci-Fi', 'Romance', 'Thriller', 'Mystery Books',
  'Self Improvement', 'Productivity', 'Time Management', 'Leadership', 'Team Building',
  'Public Speaking', 'Communication', 'Conflict Resolution', 'Emotional Intelligence',
  'Mental Health', 'Therapy', 'Counseling', 'Addiction', 'Recovery', 'Disability', 'Inclusion',
  'Diversity', 'Equality', 'Human Rights', 'Charity', 'Volunteering', 'Community Service',
  'Parenting Tips', 'Baby', 'Toddler', 'Teen', 'Education Kids', 'Homeschooling', 'College',
  'Scholarships', 'Study Abroad', 'Career Advice', 'Resume Tips', 'Interview Prep',
  'Remote Work', 'Freelancing', 'Side Hustle', 'Passive Income', 'Financial Freedom',
  'Retirement', 'Tax Tips', 'Insurance', 'Credit Score', 'Budgeting', 'Saving Money',
  'Couponing', 'Frugal Living', 'Luxury', 'Cars', 'Motorcycles', 'Boats', 'Aviation',
  'Trains', 'Trucks', 'Technology Reviews', 'Gadgets', 'Smart Home', 'Wearables', 'Drones',
  'Gaming Setup', 'PC Build', 'Console Gaming', 'Mobile Gaming', 'VR Gaming', 'Board Games',
  'Card Games', 'Poker', 'Chess', 'Esports', 'Fantasy Sports', 'Betting', 'Lottery',
  'Fashion Trends', 'Streetwear', 'Vintage', 'Sustainable Fashion', 'Sneakers', 'Accessories',
  'Jewelry', 'Watches', 'Tattoos', 'Piercings', 'Hairstyles', 'Makeup', 'Skincare',
  'Nail Art', 'Cosplay', 'Costume', 'Wedding', 'Party Planning', 'Event Planning',
  'Interior Design', 'Home Decor', 'Furniture', 'Lighting', 'Colors', 'Organization',
  'Cleaning', 'Laundry', 'Home Improvement', 'Woodworking', 'Metalworking', 'Welding',
  'Electronics', 'Repair', 'Restoration', 'Upcycling', 'Thrifting', 'Flea Market',
  'Antiques', 'Collectibles', 'Memorabilia', 'Autographs', 'Coins', 'Stamps', 'Cards',
  'Home Security', 'Self Defense', 'Weapons', 'Knives', 'Firearms', 'Tactical', 'Military',
  'Veterans', 'Law Enforcement', 'Firefighting', 'EMS', 'Medical', 'Nursing', 'Dental',
  'Veterinary', 'Pharmacy', 'Alternative Medicine', 'Herbalism', 'Holistic Health',
  'Acupuncture', 'Massage', 'Chiropractic', 'Physical Therapy', 'Nutrition', 'Diet',
  'Vegan', 'Vegetarian', 'Keto', 'Paleo', 'Gluten Free', 'Organic', 'Superfoods',
  'Smoothies', 'Juicing', 'Fermentation', 'Preserving', 'Canning', 'Brewing', 'Distilling',
  'Wine Tasting', 'Cocktails', 'Mocktails', 'BBQ', 'Grilling', 'Smoking', 'Street Food',
  'Fine Dining', 'Comfort Food', 'Desserts', 'Ice Cream', 'Chocolate', 'Candy', 'Baking Bread',
  'Pasta', 'Pizza', 'Sushi', 'Mexican', 'Italian', 'Chinese', 'Indian', 'Thai', 'Japanese',
  'Korean', 'Vietnamese', 'Mediterranean', 'French', 'American', 'Southern', 'Cajun',
];

const REGIONS = [
  'Global', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'France',
  'Italy', 'Spain', 'Netherlands', 'Sweden', 'Norway', 'Denmark', 'Finland', 'Brazil',
  'Mexico', 'Argentina', 'Colombia', 'Chile', 'India', 'China', 'Japan', 'South Korea',
  'Singapore', 'Indonesia', 'Philippines', 'Vietnam', 'Thailand', 'Malaysia', 'UAE',
  'Saudi Arabia', 'Israel', 'Turkey', 'Egypt', 'Nigeria', 'South Africa', 'Kenya',
  'Russia', 'Poland', 'Ukraine', 'Czech Republic', 'Portugal', 'Greece', 'Ireland',
  'Switzerland', 'Austria', 'Belgium', 'New Zealand', 'Pakistan', 'Bangladesh',
];

const PLATFORMS = ['TikTok', 'Instagram Reels', 'YouTube Shorts', 'LinkedIn', 'Twitter/X', 'Pinterest'];

const SAMPLE_IDEAS = [
  { hook: 'Stop overcomplicating your mornings — this 5-minute routine changed everything', angle: 'Transformational', style: 'Talking head + B-roll', score: 94, audio: 'Upbeat lo-fi', hashtags: '#morningroutine #productivity #lifehack' },
  { hook: 'My therapist said I should try this one thing and I was NOT prepared', angle: 'Personal story', style: 'Cinematic', score: 97, audio: 'Viral trending sound', hashtags: '#mentalhealth #therapy #selfcare' },
  { hook: 'The 3-second rule that doubled my income this year', angle: 'Educational', style: 'Text overlay + voiceover', score: 91, audio: 'Motivational speech', hashtags: '#money #success #mindset' },
  { hook: 'I let AI plan my entire week and here is what happened', angle: 'Experimental', style: 'Reaction + split screen', score: 88, audio: 'AI generated', hashtags: '#ai #productivity #future' },
  { hook: 'This kitchen gadget is a total game-changer (under $20)', angle: 'Review', style: 'Product showcase', score: 85, audio: 'ASMR kitchen sounds', hashtags: '#kitchenhacks #amazonfinds #budget' },
  { hook: 'We tried every diet for 30 days so you don\'t have to', angle: 'Comparison', style: 'Split screen montage', score: 93, audio: 'Upbeat electronic', hashtags: '#diet #health #experiment' },
  { hook: 'Your resume is getting rejected because of THIS mistake', angle: 'Expert advice', style: 'Screen recording + talking head', score: 90, audio: 'Professional podcast', hashtags: '#career #jobsearch #resume' },
  { hook: 'I transformed my backyard into a paradise for $200', angle: 'DIY tutorial', style: 'Timelapse + reveal', score: 96, audio: 'Satisfying music', hashtags: '#diy #gardening #transformation' },
  { hook: 'The hidden meaning behind this movie scene changes everything', angle: 'Analysis', style: 'Video essay format', score: 87, audio: 'Mysterious cinematic', hashtags: '#movies #filmanalysis #mindblown' },
  { hook: '10 minutes of this exercise burns more than an hour at the gym', angle: 'Science based', style: 'Demonstration + text overlay', score: 92, audio: 'Energetic workout music', hashtags: '#fitness #workout #science' },
  { hook: 'My grandma\'s secret recipe that no one knows about 🤫', angle: 'Cultural heritage', style: 'Cooking footage + interview', score: 95, audio: 'Traditional music', hashtags: '#cooking #family #secretrecipe' },
  { hook: 'Travel hack that saved me $5000 on my last trip', angle: 'Money saving', style: 'Listicle format', score: 89, audio: 'Wanderlust vibes', hashtags: '#travel #hacks #savemoney' },
];

const IDEAS_TABS = [
  { id: 'discover', label: 'Trending Now' },
  { id: 'region', label: 'By Region' },
  { id: 'platform', label: 'By Platform' },
  { id: 'saved', label: 'Saved Ideas' },
  { id: 'calendar', label: 'Content Calendar' },
  { id: 'scripts', label: 'Script Generator' },
  { id: 'storyboard', label: 'Storyboard Pipeline' },
  { id: 'hooks', label: 'Hook Generator' },
  { id: 'competitor', label: 'Competitor Analyzer' },
  { id: 'thumbnails', label: 'Thumbnail Generator' },
];

const TAB_MAP = {
  trending: 'discover', region: 'region', platform: 'platform', saved: 'saved',
  calendar: 'calendar', scripts: 'scripts', storyboard: 'storyboard',
  hooks: 'hooks', competitor: 'competitor', thumbnails: 'thumbnails',
};

export default function ContentIdeasStudio({ initialTab }) {
  const [ideasTab, setIdeasTab] = useState(TAB_MAP[initialTab] || 'discover');
  const [selectedNiche, setSelectedNiche] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['TikTok']);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNicheDropdown, setShowNicheDropdown] = useState(false);
  const [ideas, setIdeas] = useState([]);
  const [loading, setLoading] = useState(false);

  const filteredNiches = useMemo(() => {
    if (!searchQuery) return NICHES;
    return NICHES.filter(n => n.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [searchQuery]);

  const togglePlatform = (platform) => {
    setSelectedPlatforms(prev =>
      prev.includes(platform) ? prev.filter(p => p !== platform) : [...prev, platform]
    );
  };

  const generateIdeas = async () => {
    if (!selectedNiche) return;
    setLoading(true);

    try {
      const response = await fetch('/api/v1/content-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          niche: selectedNiche,
          region: selectedRegion,
          platforms: selectedPlatforms,
          count: 12,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setIdeas(data.ideas || []);
      } else {
        throw new Error('API not available');
      }
    } catch {
      const shuffled = [...SAMPLE_IDEAS].sort(() => Math.random() - 0.5);
      setIdeas(shuffled.slice(0, 12));
    }
    setLoading(false);
  };

  const renderByRegion = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Trending by Region</h4>
          <p className="text-xs text-[#9CA3AF]">Discover what's trending in specific countries and regions worldwide</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {REGIONS.slice(0, 20).map(r => (
          <button key={r} className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-left hover:bg-white/[0.06] transition-all">
            <span className="text-sm text-[#F9FAFB]">{r}</span>
            <span className="text-xs text-[#9CA3AF] block">{Math.floor(Math.random() * 50 + 10)} trending</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderByPlatform = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Trending by Platform</h4>
          <p className="text-xs text-[#9CA3AF]">Filter trending content by TikTok, Instagram, YouTube, LinkedIn, and more</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { name: 'TikTok', color: '#000', bg: 'bg-black/30', icon: '♪' },
          { name: 'Instagram', color: '#E1306C', bg: 'bg-pink-500/10' },
          { name: 'YouTube', color: '#FF0000', bg: 'bg-red-500/10' },
          { name: 'LinkedIn', color: '#0077B5', bg: 'bg-blue-500/10' },
          { name: 'Twitter/X', color: '#fff', bg: 'bg-white/5' },
          { name: 'Pinterest', color: '#E60023', bg: 'bg-red-500/10' },
        ].map(p => (
          <div key={p.name} className={`p-4 rounded-xl ${p.bg} border border-white/5`}>
            <h4 className="text-sm font-bold text-[#F9FAFB] mb-1">{p.name}</h4>
            <p className="text-xs text-[#9CA3AF] mb-3">Top trends on {p.name}</p>
            {[
              `${Math.random() > 0.5 ? '#' : ''}${['Viral', 'Trending', 'Popular', 'Hot'][Math.floor(Math.random() * 4)]} ${['Challenge', 'Sound', 'Format', 'Style'][Math.floor(Math.random() * 4)]}`,
            ].map((t, i) => (
              <div key={i} className="text-xs text-[#F9FAFB] py-1">• {t}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderSavedIdeas = () => (
    <div className="flex items-center justify-center py-16">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
        </div>
        <p className="text-sm text-[#F9FAFB] font-medium mb-1">No saved ideas yet</p>
        <p className="text-xs text-[#9CA3AF]">Bookmark ideas to save them for later</p>
      </div>
    </div>
  );

  const renderContentCalendar = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-bold text-[#F9FAFB]">Your Content Calendar</h4>
        <button className="px-3 py-1.5 rounded-lg bg-[#7C3AED] text-white text-xs font-medium hover:bg-[#6D28D9] transition-all">+ New Entry</button>
      </div>
      <div className="space-y-2">
        {[
          { day: 'Mon 12', items: [{ title: 'Product Launch Video', platform: 'TikTok', time: '10:00 AM' }] },
          { day: 'Wed 14', items: [{ title: 'Behind the Scenes', platform: 'Instagram', time: '2:00 PM' }, { title: 'Tutorial', platform: 'YouTube', time: '4:00 PM' }] },
          { day: 'Fri 16', items: [{ title: 'Weekly Roundup', platform: 'LinkedIn', time: '9:00 AM' }] },
        ].map((day, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
            <div className="text-xs font-semibold text-[#7C3AED] mb-2">{day.day}</div>
            {day.items.map((item, j) => (
              <div key={j} className="flex items-center gap-3 py-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#06B6D4]" />
                <span className="text-sm text-[#F9FAFB] flex-1">{item.title}</span>
                <span className="text-xs text-[#9CA3AF]">{item.platform}</span>
                <span className="text-xs text-[#6B7280]">{item.time}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  const renderScriptGenerator = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Topic / Idea</label>
        <textarea placeholder="Describe the video idea or topic..." rows={3} className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] resize-none" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Tone</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['Professional', 'Casual', 'Humorous', 'Inspirational', 'Dramatic'].map(t => <option key={t} className="bg-[#0D1321]">{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Duration</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['15 seconds', '30 seconds', '60 seconds', '2 minutes', '5 minutes'].map(d => <option key={d} className="bg-[#0D1321]">{d}</option>)}
          </select>
        </div>
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Generate Script</button>
    </div>
  );

  const renderStoryboardPipeline = () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <div className="w-12 h-12 rounded-xl bg-[#7C3AED]/10 flex items-center justify-center">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-[#F9FAFB]">Script to Storyboard Pipeline</h4>
          <p className="text-xs text-[#9CA3AF]">Convert your script into a visual storyboard, then generate bulk video</p>
        </div>
      </div>
      <div className="p-6 rounded-xl bg-white/[0.03] border border-white/5 text-center">
        <p className="text-sm text-[#9CA3AF]">Generate a script first, then convert it to a storyboard</p>
        <button className="mt-4 px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all">Start with Script</button>
      </div>
    </div>
  );

  const renderHookGenerator = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Niche / Topic</label>
        <input type="text" placeholder="e.g. fitness, finance, travel..." className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Hook Style</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['Question', 'Statistic', 'Story', 'Controversial', 'How-To', 'List'].map(s => <option key={s} className="bg-[#0D1321]">{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Count</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {[5, 10, 15, 20].map(c => <option key={c} className="bg-[#0D1321]">{c} hooks</option>)}
          </select>
        </div>
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Generate Hooks</button>
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-[#9CA3AF] text-center">Select niche and style, then generate hooks</p>
      </div>
    </div>
  );

  const renderCompetitorAnalyzer = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Competitor URL or Handle</label>
        <div className="flex gap-2">
          <input type="text" placeholder="@username or https://tiktok.com/@..." className="flex-1 h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
          <button className="px-4 py-2 rounded-lg bg-[#7C3AED] text-white text-xs font-bold hover:bg-[#6D28D9] transition-all">Analyze</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Avg Views', value: '45.2K' },
          { label: 'Engagement Rate', value: '8.3%' },
          { label: 'Posting Frequency', value: '3.5/day' },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-lg font-bold text-[#F9FAFB]">{stat.value}</div>
            <div className="text-xs text-[#9CA3AF]">{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderThumbnailGenerator = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Video Topic</label>
        <input type="text" placeholder="e.g. Best exercises for abs..." className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED]" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Style</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['Bold Text', 'Reaction Face', 'Split Screen', 'Minimal', 'Colorful'].map(s => <option key={s} className="bg-[#0D1321]">{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Aspect Ratio</label>
          <select className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED]">
            {['16:9', '1:1', '4:5', '9:16'].map(r => <option key={r} className="bg-[#0D1321]">{r}</option>)}
          </select>
        </div>
      </div>
      <button className="px-6 py-2.5 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] transition-all">Generate 5 Thumbnails</button>
    </div>
  );

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Content Ideas</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Discover trending content ideas for any niche, platform, and region
          </p>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {IDEAS_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setIdeasTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                ideasTab === tab.id
                  ? 'bg-[#7C3AED]/20 text-[#7C3AED] border border-[#7C3AED]/30'
                  : 'text-[#9CA3AF] hover:text-[#F9FAFB] border border-transparent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {ideasTab === 'discover' && (
          <>
            <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="relative">
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Niche</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedNiche || searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setSelectedNiche(''); setShowNicheDropdown(true); }}
                      onFocus={() => setShowNicheDropdown(true)}
                      placeholder="Search 200+ niches..."
                      className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm placeholder-[#6B7280] focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                    />
                    {showNicheDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-lg bg-[#0D1321] border border-white/10 shadow-2xl z-10">
                        {filteredNiches.slice(0, 30).map((n) => (
                          <button
                            key={n}
                            onClick={() => { setSelectedNiche(n); setSearchQuery(''); setShowNicheDropdown(false); }}
                            className={`w-full text-left px-3 py-2 text-sm transition-colors ${selectedNiche === n ? 'bg-[#7C3AED]/20 text-[#7C3AED]' : 'text-[#9CA3AF] hover:bg-white/5 hover:text-[#F9FAFB]'}`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#9CA3AF] mb-1.5">Region</label>
                  <select
                    value={selectedRegion}
                    onChange={(e) => setSelectedRegion(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg bg-white/5 border border-white/10 text-[#F9FAFB] text-sm focus:outline-none focus:border-[#7C3AED] focus:ring-1 focus:ring-[#7C3AED]"
                  >
                    {REGIONS.map((r) => (
                      <option key={r} value={r} className="bg-[#0D1321]">{r}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-end">
                  <button
                    onClick={generateIdeas}
                    disabled={!selectedNiche || loading}
                    className="w-full h-10 rounded-lg bg-[#7C3AED] text-white text-sm font-bold hover:bg-[#6D28D9] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                        Generate Ideas
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#9CA3AF] mb-2">Platforms</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button
                      key={p}
                      onClick={() => togglePlatform(p)}
                      className={`px-4 py-2 rounded-full text-xs font-medium border transition-all ${
                        selectedPlatforms.includes(p)
                          ? 'bg-[#7C3AED]/20 border-[#7C3AED]/30 text-[#7C3AED]'
                          : 'border-white/10 text-[#9CA3AF] hover:bg-white/5'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {ideas.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {ideas.map((idea, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-xl border border-white/10 bg-[rgba(17,24,39,0.8)] hover:bg-[rgba(17,24,39,0.95)] transition-all"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="text-[10px] font-semibold text-[#06B6D4] uppercase tracking-wider">{selectedNiche || 'Trending'}</span>
                      <div className="flex items-center gap-1.5">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#06B6D4" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        <span className="text-sm font-bold text-[#06B6D4]">{idea.score}</span>
                      </div>
                    </div>

                    <p className="text-sm text-[#F9FAFB] leading-relaxed mb-3">{idea.hook}</p>

                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                        <span className="text-[#7C3AED]">Angle:</span> {idea.angle}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                        <span className="text-[#7C3AED]">Style:</span> {idea.style}
                      </div>
                      {idea.audio && (
                        <div className="flex items-center gap-2 text-xs text-[#9CA3AF]">
                          <span className="text-[#7C3AED]">Audio:</span> {idea.audio}
                        </div>
                      )}
                      {idea.hashtags && (
                        <div className="text-xs text-[#6B7280] truncate">{idea.hashtags}</div>
                      )}
                    </div>

                    <div className="flex gap-2 pt-3 border-t border-white/10">
                      <button className="flex-1 h-8 rounded-lg bg-[#7C3AED]/20 text-[#7C3AED] text-xs font-medium hover:bg-[#7C3AED]/30 transition-all flex items-center justify-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                        Script
                      </button>
                      <button className="flex-1 h-8 rounded-lg bg-white/5 text-[#9CA3AF] text-xs font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-1.5">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        Schedule
                      </button>
                      <button className="w-8 h-8 rounded-lg bg-white/5 text-[#9CA3AF] hover:bg-white/10 transition-all flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {ideas.length === 0 && !loading && (
              <div className="flex items-center justify-center py-20">
                <div className="text-center max-w-sm">
                  <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-[#7C3AED]/10 border border-[#7C3AED]/20 flex items-center justify-center">
                    <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                  </div>
                  <h3 className="text-lg font-bold text-[#F9FAFB] mb-2">Discover Content Ideas</h3>
                  <p className="text-sm text-[#9CA3AF]">Select a niche and platform, then generate AI-powered content ideas with virality scores.</p>
                </div>
              </div>
            )}
          </>
        )}

        {ideasTab === 'region' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderByRegion()}</div>}
        {ideasTab === 'platform' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderByPlatform()}</div>}
        {ideasTab === 'saved' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderSavedIdeas()}</div>}
        {ideasTab === 'calendar' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderContentCalendar()}</div>}
        {ideasTab === 'scripts' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderScriptGenerator()}</div>}
        {ideasTab === 'storyboard' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderStoryboardPipeline()}</div>}
        {ideasTab === 'hooks' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderHookGenerator()}</div>}
        {ideasTab === 'competitor' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderCompetitorAnalyzer()}</div>}
        {ideasTab === 'thumbnails' && <div className="p-6 rounded-2xl border border-white/10 bg-[rgba(17,24,39,0.8)] backdrop-blur-sm">{renderThumbnailGenerator()}</div>}
      </div>
    </div>
  );
}
