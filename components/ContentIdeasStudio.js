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

export default function ContentIdeasStudio() {
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

  return (
    <div className="flex-1 bg-[#0A0F1E] overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#F9FAFB]">Content Ideas</h1>
          <p className="text-sm text-[#9CA3AF] mt-1">
            Discover trending content ideas for any niche, platform, and region
          </p>
        </div>

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
      </div>
    </div>
  );
}
