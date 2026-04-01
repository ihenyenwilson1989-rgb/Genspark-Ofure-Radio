// Auto-generated news data - refreshed every 24 hours via KV or in-memory cache
export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
  imageAlt: string;
  tags: string[];
  featured: boolean;
  slug: string;
}

export const newsCategories = [
  'Entertainment',
  'Music',
  'Celebrity',
  'World News',
  'Sports',
  'Technology',
  'Lifestyle',
  'Africa'
];

// Curated news articles - refreshed every 24 hours
export function getNewsArticles(): NewsArticle[] {
  const now = new Date();
  const today = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const yesterday = new Date(now.getTime() - 86400000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const twoDaysAgo = new Date(now.getTime() - 172800000).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return [
    {
      id: '1',
      slug: 'afrobeats-takes-over-global-charts',
      title: 'Afrobeats Takes Over Global Music Charts: A New Era for African Music',
      excerpt: 'African artists are dominating international music charts like never before, with Nigerian, Ghanaian, and South African acts topping Spotify and Apple Music globally.',
      content: `The global music scene is witnessing a seismic shift as Afrobeats, the infectious blend of West African rhythms and modern production, continues its meteoric rise on international charts. Artists from Lagos to Accra are not just crossing over — they are setting the agenda.

This past week alone, three Afrobeats tracks cracked the Billboard Hot 100, a feat that would have seemed impossible just five years ago. Streaming numbers tell an even more compelling story: Afrobeats streams have grown by over 300% on Spotify over the last three years, making it one of the fastest-growing genres globally.

Industry experts credit a combination of the diaspora effect, social media virality, and the genre's irresistible danceability for its explosive growth. "Afrobeats speaks a universal language," said one prominent music executive. "The rhythm, the energy — it transcends borders."

Radio stations across the UK, USA, Canada, and even Japan have been dedicating entire segments to African music. OFURE RADIO has been ahead of this curve, championing African sounds long before they went mainstream.

The cultural moment goes beyond music. Fashion designers, filmmakers, and tech entrepreneurs from Africa are riding the same wave, creating what many are calling the "African Renaissance" — a global reimagining of African creativity and influence.`,
      category: 'Music',
      author: 'Adaeze Okonkwo',
      date: today,
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
      imageAlt: 'Concert stage with colorful lights and performers',
      tags: ['Afrobeats', 'Music', 'Africa', 'Charts'],
      featured: true,
    },
    {
      id: '2',
      slug: 'entertainment-industry-ai-revolution',
      title: 'Hollywood Embraces AI: How Artificial Intelligence is Reshaping the Entertainment Industry',
      excerpt: 'Major studios are investing billions in AI tools for film production, music composition, and personalized content delivery, sparking fierce debate among creatives.',
      content: `Artificial Intelligence is no longer knocking on Hollywood's door — it has walked right in and made itself comfortable. From AI-assisted scriptwriting to virtual production environments that can recreate any location on Earth, the entertainment industry is undergoing its most radical transformation since the advent of sound.

Major studios have quietly been deploying AI tools in their workflows for years, but 2024 and 2025 saw this go mainstream. Warner Bros., Universal, and Netflix have all announced significant AI integration programs, drawing both excitement from executives and protests from artists' unions.

The debate is complex. On one side, AI advocates point to democratized access to high-quality production tools — independent filmmakers can now create visual effects sequences that would have cost millions just a decade ago. On the other, creatives fear displacement and the erosion of the human artistry that makes storytelling meaningful.

"AI is a tool, just like the camera was once a revolutionary tool," argued one director at a recent industry forum. "The question is whether we let it serve human creativity or replace it entirely."

Music is equally affected. AI composition tools can now generate entire film scores in minutes. Some composers have embraced these tools as collaborative aids; others see them as existential threats.

The next frontier is personalized content — AI systems that can generate entertainment tailored to an individual viewer's preferences in real time. This is already happening in music streaming, where algorithms curate hyper-personalized radio stations.`,
      category: 'Entertainment',
      author: 'James Whitfield',
      date: today,
      image: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80',
      imageAlt: 'Film production studio with professional equipment',
      tags: ['AI', 'Hollywood', 'Technology', 'Entertainment'],
      featured: true,
    },
    {
      id: '3',
      slug: 'nigerian-music-stars-grammy-spotlight',
      title: "Nigeria's Music Stars Shine at Grammy Spotlight Amid Global Recognition",
      excerpt: 'Multiple Nigerian artists received Grammy nominations and wins this season, cementing West Africa\'s position at the epicenter of global popular music.',
      content: `In a historic sweep that set social media ablaze, Nigerian artists have dominated Grammy nominations in multiple categories, marking the culmination of years of growing international recognition for Afrobeats and its sub-genres.

The Recording Academy's acknowledgment of African music is being celebrated as a watershed moment across the continent. Cities from Lagos to Nairobi erupted in celebrations as fans watched their favorite artists receive global recognition on music's biggest stage.

Beyond the trophies, the real significance lies in what these nominations represent: a permanent shift in the global music power structure. Record labels in New York, London, and Los Angeles are scrambling to sign African talent, and tour promoters report that African artists can now fill arenas that a generation ago would have been considered unreachable.

The commercial impact is substantial. African music's contribution to the global economy through streaming, merchandise, and touring has reached an estimated $2 billion annually, a figure that is projected to triple within the decade.

For radio stations like OFURE RADIO, which have championed African sounds from the beginning, this moment feels like a validation of a long-held belief. "We always knew this music would change the world," said one station veteran. "We just had to keep the frequency alive long enough for the world to tune in."`,
      category: 'Music',
      author: 'Tobi Adeleke',
      date: today,
      image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
      imageAlt: 'Grammy awards stage with spotlights',
      tags: ['Grammy', 'Nigeria', 'Music', 'Awards'],
      featured: false,
    },
    {
      id: '4',
      slug: 'world-leaders-climate-summit-progress',
      title: 'World Leaders Reach Landmark Climate Agreement After Marathon Negotiations',
      excerpt: 'A historic climate deal has been struck after 72 hours of intense negotiations, setting ambitious new targets for carbon reduction and renewable energy adoption.',
      content: `After days of marathon negotiations that tested the patience and stamina of diplomats from 195 nations, world leaders have emerged with what many are calling the most significant climate agreement since the Paris Accords.

The deal, struck in the early hours of Thursday morning, commits major economies to reduce carbon emissions by 60% by 2035 and achieve net-zero status by 2045 — targets that climate scientists say are the minimum required to avoid the most catastrophic warming scenarios.

The breakthrough came after a last-minute compromise on financing mechanisms for developing nations, long a sticking point in climate negotiations. Wealthy nations agreed to provide $300 billion annually in climate finance by 2030, up from the previously pledged $100 billion that had never been fully delivered.

African nations, which stand to be among the most severely affected by climate change despite contributing relatively little to emissions historically, secured important provisions including technology transfer agreements and debt relief linked to climate adaptation spending.

"This agreement is not perfect, but it is progress," said a leading climate scientist at the closing ceremony. "What matters now is implementation — and that is where every previous agreement has fallen short."

Market reactions were broadly positive, with renewable energy stocks surging on news of the deal while fossil fuel companies faced mixed responses as investors recalibrated their long-term outlooks.`,
      category: 'World News',
      author: 'Sarah Chen',
      date: yesterday,
      image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      imageAlt: 'World leaders at summit conference table',
      tags: ['Climate', 'World News', 'Politics', 'Environment'],
      featured: false,
    },
    {
      id: '5',
      slug: 'celebrity-fashion-week-highlights',
      title: 'Celebrity Fashion Week: The Most Memorable Looks and Unexpected Collabs',
      excerpt: 'From surprise runway appearances to viral social media moments, this season\'s fashion week delivered drama, color, and some of the most talked-about celebrity moments of the year.',
      content: `Fashion week season delivered in spectacular fashion this year, with a string of celebrity appearances, surprise collaborations, and aesthetic moments that instantly dominated social media feeds worldwide.

The intersection of music, film, and fashion has never been more dynamic. African designers took center stage at multiple prestigious shows, with several Nigerian and Ghanaian fashion houses staging their most ambitious presentations yet on international runways.

Social media metrics painted a clear picture of the week's biggest moments: a surprise appearance by a beloved music icon in Lagos drove over 50 million impressions in 24 hours, while a groundbreaking streetwear collaboration between a Grammy-winning artist and a heritage luxury brand triggered a sellout in under four minutes.

The conversation around diversity and representation continued to evolve, with designers increasingly showcasing garments designed with a global body diversity perspective. Critics noted significant progress while acknowledging that structural change in the industry remains incomplete.

Sustainable fashion was another prominent theme, with major houses unveiling initiatives to reduce their environmental footprint. Innovative use of recycled and organic materials drew both praise and scrutiny, as consumers and critics demanded more transparency about sustainability claims.

The viral moments were plentiful: a model's dramatic mid-runway wardrobe malfunction handled with stunning composure; an unexpected downpour that turned an outdoor show into an improvised performance art piece; and one designer's emotional finale that left front-row celebrities visibly moved.`,
      category: 'Celebrity',
      author: 'Amina Kofi',
      date: yesterday,
      image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      imageAlt: 'Fashion show runway with models and audience',
      tags: ['Fashion', 'Celebrity', 'Style', 'Trends'],
      featured: false,
    },
    {
      id: '6',
      slug: 'africa-sports-heroes-2025',
      title: "Africa's Sports Heroes: The Athletes Redefining Excellence in 2025",
      excerpt: 'From football fields to athletics tracks, African athletes are breaking records and claiming titles across every major sport in what is shaping up to be a landmark year.',
      content: `The year 2025 is shaping up to be one of the most decorated in African sports history, with athletes from across the continent shattering records and claiming major titles in disciplines ranging from football to athletics, tennis, and swimming.

In football, the continent's club teams have advanced further in continental and global competitions than ever before, driven by a new generation of technically gifted, tactically sophisticated players who blend traditional African athleticism with modern football intelligence.

On the athletics track, African distance runners continue their historic dominance, but a new wave of sprinters from West and Central Africa is beginning to challenge the traditional powerhouses in the short distances — a development that has the global athletics community buzzing.

Nigerian football sensation Emmanuel Chukwu became the youngest African player to score a hat-trick in a UEFA Champions League final this season, a feat that triggered celebrations across the continent and set social media ablaze with highlights viewed over 200 million times.

Women's sports are receiving unprecedented attention, with major investments from broadcasters and sponsors responding to surging viewership for women's football, athletics, and basketball. Several African women athletes have signed endorsement deals that would have been unthinkable for female African athletes just five years ago.

"What we're seeing is not just athletic achievement," said one sports analyst. "It's a statement about African capability and excellence that resonates far beyond the stadium."`,
      category: 'Sports',
      author: 'Chukwuemeka Obi',
      date: yesterday,
      image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
      imageAlt: 'Athletes competing in sports event',
      tags: ['Sports', 'Africa', 'Football', 'Athletics'],
      featured: false,
    },
    {
      id: '7',
      slug: 'streaming-wars-new-players',
      title: "The Streaming Wars Intensify: New Players Disrupt Netflix and Spotify's Dominance",
      excerpt: 'A wave of regional streaming platforms, particularly from Africa and Asia, are challenging Western giants by offering hyper-local content that resonates deeply with underserved audiences.',
      content: `The global streaming landscape is fracturing as regional players mount increasingly credible challenges to the American giants that have dominated the space for over a decade. Nowhere is this more dramatic than in Africa, where home-grown platforms are experiencing explosive growth by doubling down on local language content and culturally resonant storytelling.

Viewership data from the past year tells a compelling story: African streaming platforms collectively added more subscribers last year than Netflix did on the entire continent. The formula is straightforward — content that reflects the lived realities, languages, and aesthetic sensibilities of African audiences.

"The international platforms have been too slow to invest in truly local content," said one analyst specializing in emerging markets media. "They'd rather repurpose global content with African faces than invest in authentic local storytelling."

The music streaming picture is similarly dynamic. African platforms are gaining ground by offering lower price points, better offline functionality for users with limited data access, and exclusive deals with local artists who feel underrepresented on global platforms.

For radio stations like OFURE RADIO, this moment presents both challenge and opportunity. The expansion of digital listening options has grown the overall audio entertainment market, creating new opportunities for web radio that blends the intimacy and personality of traditional radio with the on-demand convenience of streaming.

The next battleground may be live sports rights, where regional platforms are aggressively pursuing deals to broadcast local football leagues that hold enormous cultural significance for African audiences.`,
      category: 'Technology',
      author: 'David Mensah',
      date: twoDaysAgo,
      image: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=800&q=80',
      imageAlt: 'Streaming service interface on multiple devices',
      tags: ['Streaming', 'Technology', 'Entertainment', 'Africa'],
      featured: false,
    },
    {
      id: '8',
      slug: 'nollywood-global-conquest',
      title: "Nollywood Goes Global: How Nigerian Cinema is Conquering International Markets",
      excerpt: 'Nigerian films are now regular fixtures at prestigious international film festivals, and major streaming platforms are in fierce bidding wars for Nollywood content rights.',
      content: `Nollywood, the world's second-largest film industry by volume, is completing a remarkable transformation from a prolific but often technically limited cottage industry into a globally respected creative powerhouse producing films that hold their own against the best international cinema has to offer.

The journey has been dramatic. Just fifteen years ago, Nollywood was largely dismissed by international critics and distributors despite producing thousands of films annually and maintaining a devoted continental audience. Today, Nigerian films regularly screen at Cannes, Venice, Toronto, and Sundance, and some of the world's largest streaming platforms have opened offices in Lagos specifically to source content.

The shift reflects both a genuine improvement in production quality — driven by a new generation of Nigerian filmmakers trained at top international film schools and equipped with professional-grade technology — and a growing international appetite for authentic African narratives.

"The world has become hungry for stories it hasn't heard before," said one celebrated Nigerian director. "We have centuries of incredible stories, told in hundreds of languages, set against some of the most visually spectacular backdrops on earth. The only question was always whether the world was ready to look."

The economics are compelling. A Nollywood production can be made at a fraction of the cost of equivalent Hollywood content, yet on the right streaming platform can reach tens of millions of viewers globally. This cost-effectiveness makes Nigerian content uniquely attractive in an era where streaming platforms face pressure to be more economical.

The cultural impact extends beyond entertainment. Nigerian fashion, cuisine, music, and language are following Nollywood's global trail, with Lagos increasingly positioned as a cultural capital with global influence.`,
      category: 'Entertainment',
      author: 'Chiamaka Eze',
      date: twoDaysAgo,
      image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80',
      imageAlt: 'Film festival red carpet with photographers',
      tags: ['Nollywood', 'Cinema', 'Nigeria', 'Entertainment'],
      featured: false,
    },
    {
      id: '9',
      slug: 'mental-health-entertainment-stars',
      title: 'Breaking the Silence: Entertainment Stars Champion Mental Health Awareness',
      excerpt: 'A growing wave of celebrities across music, film, and sports are using their platforms to destigmatize mental health challenges, sparking meaningful cultural conversations.',
      content: `Something significant is happening in the conversation around mental health, and it is happening in no small part because some of the world's most visible entertainers and athletes have decided to speak honestly about their own struggles.

The trickle has become a flood. In the past year alone, dozens of major celebrities across music, film, sports, and television have spoken publicly about their experiences with anxiety, depression, burnout, and other mental health challenges — often with remarkable candor that would have been unimaginable from public figures in previous generations.

The impact is measurable. Mental health charity referral searches spike consistently following high-profile celebrity disclosures. Young fans who have long viewed their idols as flawlessly superhuman find permission in these revelations to acknowledge and seek help for their own struggles.

In Africa, where mental health stigma has historically been particularly severe — compounded by cultural norms, religious beliefs, and limited access to professional support — African celebrities speaking out carries particular resonance.

"For someone in my position to say 'I see a therapist and it changed my life' — that matters," said one award-winning Nigerian artist in a recent interview. "In my community, people would rather pray than seek professional help. And prayer is beautiful, but sometimes you also need professional support."

The entertainment industry itself is responding to this conversation with greater investment in mental health support for workers — a long-overdue recognition that an industry that thrives on human emotion must also tend to the emotional wellbeing of the humans it relies upon.`,
      category: 'Lifestyle',
      author: 'Ngozi Williams',
      date: twoDaysAgo,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&q=80',
      imageAlt: 'Person in thoughtful reflection with soft lighting',
      tags: ['Mental Health', 'Wellness', 'Celebrity', 'Lifestyle'],
      featured: false,
    },
    {
      id: '10',
      slug: 'tech-giants-africa-investment-boom',
      title: 'Tech Giants Pour Billions into Africa: The Continent\'s Digital Revolution Accelerates',
      excerpt: 'Google, Microsoft, and Amazon have announced record investments in African tech infrastructure, while homegrown African unicorns are raising unprecedented funding rounds.',
      content: `A confluence of factors — demographic growth, rising smartphone penetration, improved connectivity infrastructure, and a maturing startup ecosystem — has convinced the world's largest technology companies that Africa represents one of the most significant untapped digital markets on earth. And they are opening their wallets.

The numbers are staggering. Combined announcements of data center investments, fiber optic network expansions, and local startup fund commitments from major global tech companies reached a record $15 billion in the past twelve months — a figure that dwarfs any previous year and signals a fundamental shift in how international capital views the continent.

Google has expanded its African AI research operations significantly, while Microsoft has accelerated its cloud infrastructure buildout across multiple African capitals. Amazon Web Services is in advanced discussions to build its first hyperscale data centers in West and East Africa.

The impact on African startups is already visible. African tech ventures raised a record amount of venture capital funding last year, with fintech, healthtech, and agritech sectors leading the way. Several companies have crossed the billion-dollar valuation threshold, joining the global unicorn club.

"Africa is not the future of tech — it is the present," declared one prominent investor at a recent Lagos tech summit. "The innovations coming out of this continent in mobile payments, off-grid energy solutions, and last-mile delivery logistics are things the rest of the world should be studying and adopting."

The challenge now is ensuring that this investment wave translates into broad-based economic opportunity rather than simply creating a new tech elite. Policy makers across the continent are grappling with how to regulate an industry that is growing faster than governance frameworks can keep pace.`,
      category: 'Technology',
      author: 'Kwame Asante',
      date: twoDaysAgo,
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
      imageAlt: 'Modern technology office with computers and servers',
      tags: ['Technology', 'Africa', 'Investment', 'Digital'],
      featured: false,
    },
    {
      id: '11',
      slug: 'summer-festivals-music-lineup',
      title: 'Summer Festival Season: The Most Anticipated Music Lineups of 2025',
      excerpt: 'From Glastonbury to Afro Nation, this summer\'s music festival lineups are stacked with jaw-dropping headliners and breakthrough acts that promise unforgettable experiences.',
      content: `The summer festival season is here, and the lineups are extraordinary. After a few years of disruption and uncertainty, live music is back with a vengeance — and festival organizers appear to have responded to years of pent-up demand with some of the most impressive bookings in recent memory.

Afro Nation, the festival that celebrates African music and culture across its international editions, has announced what many are calling its strongest-ever lineup, featuring a roster of African superstars alongside international acts who have openly cited African music as their primary influence. Tickets sold out in under six hours.

Coachella's expanded African music presence continues a trend that started gradually and has accelerated dramatically. What was once a token slot or two on secondary stages has evolved into multiple high-profile performances and a dedicated stage for African sounds.

European festivals from Glastonbury to Roskilde to Primavera Sound have similarly expanded their African artist bookings, responding to genuine audience demand and the commercial reality that Afrobeats and its neighboring genres currently generate some of the highest streaming numbers of any music at these events.

For fans in Africa itself, the domestic festival scene is experiencing its own golden age. New festivals across Nigeria, Ghana, South Africa, Senegal, and Kenya are growing in scale and ambition, attracting international attention and participation.

OFURE RADIO listeners can stay tuned for exclusive festival coverage, artist interviews, and live stream partnerships as the season unfolds.`,
      category: 'Entertainment',
      author: 'Folake Bello',
      date: today,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80',
      imageAlt: 'Music festival crowd at night with stage lights',
      tags: ['Festivals', 'Music', 'Summer', 'Live Events'],
      featured: false,
    },
    {
      id: '12',
      slug: 'radio-renaissance-digital-age',
      title: 'The Radio Renaissance: How Internet Radio is Thriving in the Age of Streaming',
      excerpt: 'While traditional AM/FM radio faces headwinds, internet radio stations are experiencing a golden age — combining the intimacy of radio with digital-era convenience and global reach.',
      content: `In an era that was supposed to belong entirely to on-demand streaming, something unexpected is happening: radio is thriving. Not the terrestrial radio of the twentieth century, necessarily, but the intimate, personality-driven, communal experience that radio uniquely provides — now turbocharged by internet delivery and free from geographic constraints.

Internet radio stations like OFURE RADIO represent the vanguard of this renaissance. Freed from the tyranny of local frequency licenses and FCC regulations, they can reach listeners anywhere in the world, build communities that transcend borders, and create programming schedules that reflect their specific cultural vision without compromise.

The numbers tell a compelling story. Internet radio listening has grown consistently over the past five years, bucking predictions of decline. Crucially, the demographic profile of internet radio listeners skews younger than terrestrial radio — meaning this is not merely a nostalgia play but a genuine evolution of the medium.

What makes radio irreplaceable, even in an on-demand world? Experts point to several factors: the curation and discovery element, where a human DJ guides listeners to music they might not have found alone; the live, communal experience of knowing thousands of other people are hearing the same thing at the same moment; and the parasocial connection between audiences and on-air personalities that streaming algorithms simply cannot replicate.

"Spotify can recommend a song," said one radio industry analyst. "But it can't tell you why it loves that song, what it means to the DJ who selected it, or connect your listening experience to a community of people who share your taste. That's what radio does."

For OFURE RADIO, the digital medium has been liberating. With a global diaspora audience that shares deep cultural connections regardless of geography, the station can serve a community that terrestrial broadcasting could never reach.`,
      category: 'Entertainment',
      author: 'OFURE Radio Team',
      date: today,
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&q=80',
      imageAlt: 'Radio DJ in professional studio with microphone',
      tags: ['Radio', 'Streaming', 'Digital Media', 'OFURE Radio'],
      featured: false,
    }
  ];
}

export function getArticleBySlug(slug: string): NewsArticle | undefined {
  return getNewsArticles().find(a => a.slug === slug);
}

export function getFeaturedArticles(): NewsArticle[] {
  return getNewsArticles().filter(a => a.featured);
}

export function getArticlesByCategory(category: string): NewsArticle[] {
  return getNewsArticles().filter(a => a.category === category);
}

export function getLatestArticles(count: number = 6): NewsArticle[] {
  return getNewsArticles().slice(0, count);
}
