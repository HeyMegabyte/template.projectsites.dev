#!/usr/bin/env node
// Generates examples/_content.<vertical>.json — deterministic per-vertical DEFAULT
// section content. Used by projectsites container-server.mjs (applyVerticalContentPack)
// so a generated site is never a self-hiding stub when AI research is thin.
// Name-agnostic copy (no {TOKEN} inside values), Flesch >= 60, no slop words.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'examples');

// Per-vertical spec. Arrays are positional; the mapper below flattens them to tokens.
const V = {
  medical: {
    hero: ['Gentle dental care for your whole family', 'From routine cleanings to same-day emergencies, we keep every smile healthy and comfortable. New patients are always welcome.', 'Book a visit', 'See services'],
    badges: ['Most insurance accepted', 'Same-day emergency visits', 'Gentle, judgment-free care'],
    features: [['Comfort-first visits', 'Numbing, sedation options, and a calm team make every appointment easy.'], ['Same-day emergencies', 'Call in pain and we will get you seen the same day whenever we can.'], ['Clear, upfront pricing', 'You see the cost and your insurance estimate before we begin.'], ['Family-friendly', 'One trusted office for kids, parents, and grandparents alike.'], ['Modern, gentle tech', 'Digital X-rays and quiet tools mean less waiting and less discomfort.'], ['Easy scheduling', 'Book online, get reminders, and reschedule in a couple of taps.']],
    servicesHead: ['Complete care under one roof', 'Preventive, restorative, and cosmetic dentistry for every stage of life.'],
    services: [['Cleanings & Exams', 'Thorough cleanings and check-ups that catch small problems early. We explain everything we see in plain language.'], ['Fillings & Crowns', 'Tooth-colored fillings and durable crowns that restore comfort and blend right in. Most are done in one or two visits.'], ['Teeth Whitening', 'Safe, professional whitening that lifts years of stains. Take-home trays keep your smile bright.'], ['Invisalign & Aligners', 'Straighten your teeth with clear, removable aligners. We map the full plan before you start.'], ['Dental Implants', 'Permanent, natural-looking replacements for missing teeth. They restore both chewing and confidence.'], ['Emergency Care', 'Chipped, cracked, or aching? We reserve daily slots for urgent visits and fast relief.']],
    servicesCta: ['Not sure what you need?', 'Book a check-up and we will build a simple, honest plan together.'],
    statsHead: 'Trusted by neighbors for years',
    stats: [['25+ Years', 'caring for local families'], ['15k+ Patients', 'and still growing'], ['4.9 Stars', 'across patient reviews'], ['Same Day', 'emergency appointments']],
    process: [['Book', 'Reserve online or call, and tell us what is bothering you.'], ['Meet', 'We listen, examine gently, and explain what we find.'], ['Plan', 'You get clear options and pricing with no pressure.'], ['Care', 'We treat comfortably and keep your smile healthy for good.']],
    faqHead: ['Questions patients ask', 'Straight answers about visits, insurance, and comfort.'],
    faqs: [['Do you accept my insurance?', 'We accept most major plans and file the claims for you. Call us with your card and we will confirm your coverage.'], ['I am nervous about the dentist. Can you help?', 'Absolutely. We offer numbing and sedation options and move at your pace, with no judgment about time away from care.'], ['Do you see children?', 'Yes. We care for every age, so the whole family can share one trusted office.'], ['What if I have a dental emergency?', 'Call us right away. We hold same-day slots for pain, chips, and swelling and will get you seen fast.']],
    cta: ['Ready for a healthier smile?', 'New patients welcome. Book a visit today and feel the difference gentle care makes.', 'Book your visit'],
    about: ['Care that treats you like family', 'Our team blends modern dentistry with an old-fashioned bedside manner. We take time to listen, explain, and make every visit comfortable.', 'Our promise to you', 'Honest recommendations, gentle hands, and a healthy smile that lasts. That is the standard we hold on every single visit.'],
    meta: ['A friendly family dental practice offering gentle cleanings, crowns, whitening, implants, and same-day emergency care.', 'Explore our dental services: cleanings, fillings, crowns, whitening, Invisalign, implants, and emergency care.'],
  },
  wellness: {
    hero: ['Move, breathe, and feel restored', 'A welcoming studio for every body and every level. Find strength, calm, and a community that cheers you on.', 'Start your first class', 'View schedule'],
    badges: ['All levels welcome', 'First class on us', 'Small, personal classes'],
    features: [['Every body welcome', 'Beginners and lifelong practitioners share the same warm, judgment-free space.'], ['Expert instructors', 'Certified teachers guide you safely and adjust for your goals.'], ['Flexible schedule', 'Morning, midday, and evening classes fit around real life.'], ['Calm, clean space', 'A quiet, spotless studio designed to help you unwind the moment you arrive.'], ['Community first', 'Make friends, stay accountable, and celebrate small wins together.'], ['Easy booking', 'Reserve your mat online and get a friendly reminder before class.']],
    servicesHead: ['Classes for strength and calm', 'From gentle stretch to a good sweat, there is a class for how you feel today.'],
    services: [['Vinyasa Flow', 'Link breath and movement in a flowing, energizing practice. Great for building strength and focus.'], ['Gentle & Restorative', 'Slow, supported poses that release tension and calm the nervous system. Perfect after a long week.'], ['Power Yoga', 'A stronger, faster class that builds heat and stamina. Modifications keep it accessible.'], ['Meditation & Breathwork', 'Simple, guided practices to quiet the mind and steady your breath. No experience needed.'], ['Pilates & Core', 'Low-impact work that builds a strong, stable center and better posture.'], ['Private Sessions', 'One-on-one guidance tailored to your body, goals, and pace.']],
    servicesCta: ['New to the practice?', 'Try an intro class and we will help you find the right fit.'],
    statsHead: 'A community that keeps growing',
    stats: [['10+ Years', 'in the neighborhood'], ['30+ Classes', 'every week'], ['4.9 Stars', 'from our members'], ['All Levels', 'truly welcome']],
    process: [['Reserve', 'Book your spot online in under a minute.'], ['Arrive', 'Come as you are; we have mats and props ready.'], ['Practice', 'Move at your pace with caring, expert guidance.'], ['Glow', 'Leave lighter, stronger, and ready for your week.']],
    faqHead: ['Before your first class', 'Everything a first-timer wants to know.'],
    faqs: [['I have never done this before. Is that okay?', 'Completely. Our classes welcome beginners, and instructors offer easy options for every pose.'], ['What should I bring?', 'Just comfortable clothes and water. We provide mats and props if you need them.'], ['How early should I arrive?', 'Come about ten minutes early to settle in and meet your instructor.'], ['Do you offer memberships?', 'Yes, along with class packs and drop-ins, so you can practice on your own terms.']],
    cta: ['Your first class is on us', 'Roll out a mat, take a breath, and see how good it feels to slow down.', 'Claim your class'],
    about: ['A studio built for real people', 'We created a calm, welcoming space where anyone can build strength and find balance. No cliques, no pressure, just good movement and good company.', 'Why we teach', 'We believe a steady practice changes lives, one breath at a time. Our mission is to make that practice feel like home.'],
    meta: ['A welcoming yoga and wellness studio with classes for every level: flow, restorative, power, meditation, and Pilates.', 'Browse our classes: vinyasa flow, restorative, power yoga, meditation, Pilates, and private sessions for all levels.'],
  },
  legal: {
    hero: ['Trusted counsel when it matters most', 'Clear advice, steady guidance, and a team that fights for your outcome. We handle the details so you can move forward.', 'Request a consultation', 'Our practice areas'],
    badges: ['Free initial consultation', 'Decades of experience', 'Straight, honest advice'],
    features: [['Clear communication', 'You get plain-language updates and a lawyer who returns your calls.'], ['Proven results', 'Years of favorable outcomes for clients in situations like yours.'], ['Personal attention', 'Your case is handled by a senior attorney, not passed down the hall.'], ['Confidential & discreet', 'Your matter stays private, handled with care at every step.'], ['Fair, transparent fees', 'You know the structure up front, with no surprise bills.'], ['Responsive team', 'Questions answered quickly, because timing often matters.']],
    servicesHead: ['Areas we practice', 'Focused, experienced representation across the matters families and businesses face most.'],
    services: [['Family Law', 'Divorce, custody, and support handled with discretion and care. We protect what matters most to you.'], ['Estate Planning', 'Wills, trusts, and powers of attorney that give your family clarity and peace of mind.'], ['Personal Injury', 'If you were hurt by someone else, we pursue the full recovery you deserve. No fee unless we win.'], ['Business Law', 'Formation, contracts, and disputes handled so you can run your company with confidence.'], ['Real Estate', 'Smooth closings and clear contracts for buyers, sellers, and owners.'], ['Wills & Probate', 'Compassionate guidance through probate and the settling of an estate.']],
    servicesCta: ['Not sure where you stand?', 'Book a free consultation and get a clear, honest read on your options.'],
    statsHead: 'A record clients rely on',
    stats: [['30+ Years', 'of combined experience'], ['1,000+ Cases', 'resolved for clients'], ['Free', 'initial consultation'], ['5.0 Stars', 'from those we represent']],
    process: [['Consult', 'Tell us your situation in a free, confidential meeting.'], ['Strategy', 'We map a clear plan and explain every option.'], ['Advocate', 'We handle the filings, negotiations, and hard conversations.'], ['Resolve', 'We pursue the strongest outcome and keep you informed throughout.']],
    faqHead: ['Common questions', 'What to expect when you work with our firm.'],
    faqs: [['How much does a consultation cost?', 'Your initial consultation is free. We will review your situation and explain your options with no obligation.'], ['How are your fees structured?', 'It depends on the matter. Many cases are flat-fee or contingency, and we explain the structure clearly up front.'], ['How long will my case take?', 'Every matter is different, but we give you a realistic timeline early and keep you updated at each step.'], ['Will I work with the same attorney?', 'Yes. A senior attorney handles your case directly, so you always speak with someone who knows the details.']],
    cta: ['Let us review your case', 'Schedule a free, confidential consultation and get clear guidance on your next move.', 'Request consultation'],
    about: ['Experienced advocates in your corner', 'Our attorneys combine deep courtroom experience with genuine care for the people we represent. We treat every client the way we would want our own family treated.', 'Our commitment', 'Honest counsel, tireless advocacy, and a clear path forward, no matter how complex the matter.'],
    meta: ['An experienced law firm offering family law, estate planning, personal injury, business, and real estate representation.', 'Our practice areas: family law, estate planning, personal injury, business law, real estate, and probate.'],
  },
  restaurant: {
    hero: ['Fresh flavors, made from scratch', 'A warm table for family and friends, with a menu built from local ingredients and a whole lot of heart.', 'Reserve a table', 'View menu'],
    badges: ['Locally sourced', 'Reservations welcome', 'Private events & catering'],
    features: [['Made from scratch', 'We cook everything in house, from the sauces to the desserts.'], ['Local ingredients', 'We source from nearby farms, so the menu changes with the season.'], ['Warm atmosphere', 'A cozy room that feels right for date night or the whole family.'], ['Catering & events', 'From office lunches to celebrations, we bring the flavor to you.'], ['Craft drinks', 'A thoughtful list of wine, beer, and house cocktails.'], ['Easy reservations', 'Book your table online in seconds.']],
    servicesHead: ['On the menu', 'Honest, delicious food made fresh every day.'],
    services: [['Chef Specials', 'Seasonal plates the kitchen dreams up each week using the best local finds. Ask your server what is fresh today.'], ['Brunch', 'Weekend favorites from fluffy pancakes to savory hash, plus bottomless coffee.'], ['Dinner', 'Hearty mains and shareable plates made to gather around. Something for every appetite.'], ['Catering', 'Crowd-pleasing spreads for meetings, parties, and celebrations, delivered on time.'], ['Private Events', 'Host your next gathering in our space with a menu built for the occasion.'], ['Desserts', 'House-made sweets worth saving room for, baked fresh daily.']],
    servicesCta: ['Planning a gathering?', 'Ask about catering and private events, and we will make it easy.'],
    statsHead: 'A neighborhood favorite',
    stats: [['15+ Years', 'serving the community'], ['100% Scratch', 'kitchen, every day'], ['4.8 Stars', 'from happy guests'], ['Local', 'farms and suppliers']],
    process: [['Reserve', 'Book a table online or give us a call.'], ['Arrive', 'Settle in and let us take care of the rest.'], ['Savor', 'Enjoy fresh, made-from-scratch plates and friendly service.'], ['Return', 'Come back for the seasonal specials you will not find anywhere else.']],
    faqHead: ['Good to know', 'Answers before you visit.'],
    faqs: [['Do you take reservations?', 'Yes, you can book online or call us. Walk-ins are always welcome too, based on availability.'], ['Do you offer catering?', 'We do. From office lunches to celebrations, we cater events of every size with fresh, made-to-order food.'], ['Do you have vegetarian or gluten-free options?', 'Plenty. Our menu marks these dishes, and the kitchen is happy to accommodate dietary needs.'], ['Can I host a private event?', 'Absolutely. Reach out and we will help you plan a menu and space that fit your occasion.']],
    cta: ['Come hungry, leave happy', 'Reserve your table today and taste the difference fresh, local, and made-from-scratch makes.', 'Reserve a table'],
    about: ['Good food, made with heart', 'We started with a simple idea: cook honest food from local ingredients and treat every guest like family. That is still exactly what we do.', 'Our kitchen philosophy', 'Fresh over frozen, local over far away, and made from scratch every single day. Great food should taste like someone cared, because we do.'],
    meta: ['A neighborhood restaurant serving fresh, made-from-scratch food from local ingredients, with catering and private events.', 'See our menu: chef specials, brunch, dinner, desserts, plus catering and private events for any occasion.'],
  },
  'local-service': {
    hero: ['Reliable service, done right the first time', 'Licensed, insured, and on time. From urgent repairs to planned upgrades, we treat your home like our own.', 'Get a free quote', 'Our services'],
    badges: ['Licensed & insured', 'Upfront pricing', 'Same-day service available'],
    features: [['On-time, every time', 'We show up in the window we promise and respect your schedule.'], ['Upfront pricing', 'You approve the price before we start, with no surprise charges.'], ['Licensed & insured', 'Fully credentialed pros protect your home and your peace of mind.'], ['Fast response', 'Urgent problem? We offer same-day and emergency service.'], ['Clean & respectful', 'We protect your floors, tidy up, and treat your home with care.'], ['Workmanship guaranteed', 'If it is not right, we make it right. Simple as that.']],
    servicesHead: ['What we do', 'Dependable repairs, installs, and maintenance for your home.'],
    services: [['Repairs', 'Fast, lasting fixes for the problems that pop up when you least expect them. We diagnose honestly and fix it right.'], ['Installations', 'Expert installation of new fixtures and systems, done to code and built to last.'], ['Maintenance Plans', 'Scheduled tune-ups that prevent breakdowns and extend the life of your equipment.'], ['Emergency Service', 'When something fails after hours, we are ready with fast, same-day help.'], ['Upgrades', 'Modern, efficient upgrades that lower your bills and improve comfort.'], ['Inspections', 'Thorough checks with a clear report, so you know exactly where you stand.']],
    servicesCta: ['Got a project or a problem?', 'Get a free, no-pressure quote and we will handle the rest.'],
    statsHead: 'Homeowners trust our team',
    stats: [['20+ Years', 'serving the area'], ['5,000+ Jobs', 'done right'], ['Same Day', 'service available'], ['4.9 Stars', 'from local homeowners']],
    process: [['Call', 'Tell us the problem and we will schedule a visit fast.'], ['Quote', 'We assess and give you a clear, upfront price.'], ['Fix', 'We do the work cleanly, correctly, and on time.'], ['Guarantee', 'We stand behind every job and back it in writing.']],
    faqHead: ['Questions homeowners ask', 'The details before you book.'],
    faqs: [['Do you offer free estimates?', 'Yes. We provide a clear, no-obligation quote before any work begins.'], ['Are you licensed and insured?', 'We are fully licensed and insured, so your home and our team are protected on every job.'], ['Do you handle emergencies?', 'We do. We offer same-day and after-hours service for urgent problems that cannot wait.'], ['Do you guarantee your work?', 'Every job is backed by our workmanship guarantee. If something is not right, we return and fix it.']],
    cta: ['Need it fixed? We are ready', 'Request your free quote today and get dependable service from a team you can trust.', 'Get a free quote'],
    about: ['Your dependable local pros', 'We built our reputation the hard way: by showing up on time, charging fair prices, and doing honest work. Our neighbors know they can count on us.', 'How we work', 'Straight answers, upfront pricing, and quality that lasts. We treat your home the way we would treat our own.'],
    meta: ['Licensed, insured local pros offering fast repairs, installations, maintenance, and same-day emergency service.', 'Our services: repairs, installations, maintenance plans, emergency service, upgrades, and inspections.'],
  },
  nonprofit: {
    hero: ['Together, we can do more', 'Every gift and every volunteer hour creates real change in our community. Join us and see the difference you make.', 'Donate now', 'Get involved'],
    badges: ['Every dollar counts', '100% local impact', 'Volunteers always welcome'],
    features: [['Real, local impact', 'Your support stays here and helps neighbors who need it most.'], ['Transparent stewardship', 'We share where funds go, so you can give with confidence.'], ['Volunteer-powered', 'Caring people, not overhead, drive the work we do.'], ['Every gift matters', 'Small or large, every donation moves the mission forward.'], ['Community partners', 'We work alongside local groups to reach more people.'], ['Easy ways to help', 'Give, volunteer, or spread the word in just a few minutes.']],
    servicesHead: ['Our programs', 'Practical, caring work that meets real needs in our community.'],
    services: [['Food & Essentials', 'We provide meals and basic necessities to families facing hard times, with dignity and warmth.'], ['Youth Programs', 'Safe spaces, mentoring, and learning that help young people thrive.'], ['Community Outreach', 'We meet people where they are and connect them with the help they need.'], ['Emergency Support', 'Fast assistance for neighbors facing a sudden crisis.'], ['Volunteer Corps', 'Hands-on opportunities to serve, whatever your skills or schedule.'], ['Education & Advocacy', 'We raise awareness and give voice to the people we serve.']],
    servicesCta: ['Ready to make a difference?', 'Give or volunteer today, and help us reach more neighbors.'],
    statsHead: 'The difference we make together',
    stats: [['50k+ Meals', 'served this year'], ['1,200+ Families', 'supported'], ['300+ Volunteers', 'giving their time'], ['100% Local', 'impact you can see']],
    process: [['Give', 'Make a secure donation in just a minute.'], ['Multiply', 'Your gift joins others to fund real programs.'], ['Serve', 'Volunteers turn support into hands-on help.'], ['Change', 'Together we create lasting change for our neighbors.']],
    faqHead: ['Questions supporters ask', 'How your support creates change.'],
    faqs: [['How is my donation used?', 'The large majority of every gift goes directly to programs. We publish our impact so you can see exactly where funds go.'], ['Is my donation tax-deductible?', 'Yes. We are a registered nonprofit and provide a receipt for every gift you make.'], ['How can I volunteer?', 'We welcome volunteers of all backgrounds. Reach out and we will match you with a role that fits your time and skills.'], ['Can my company get involved?', 'Absolutely. We partner with local businesses on giving, sponsorships, and team volunteer days.']],
    cta: ['Your gift changes lives', 'Donate today and help us bring food, hope, and support to neighbors who need it.', 'Donate now'],
    about: ['Neighbors helping neighbors', 'We are a community of donors, volunteers, and staff united by one belief: everyone deserves care and a real chance. Together, we turn that belief into action.', 'Our mission', 'To meet urgent needs today and build a stronger, more caring community for tomorrow, one neighbor at a time.'],
    meta: ['A local nonprofit providing food, youth programs, outreach, and emergency support. Donate or volunteer to make an impact.', 'Explore our programs: food and essentials, youth programs, outreach, emergency support, and volunteer opportunities.'],
  },
  retail: {
    hero: ['Gear built for how you live', 'Quality goods, honest prices, and fast shipping. Find pieces made to last, backed by people who actually use them.', 'Shop now', 'Browse collections'],
    badges: ['Free shipping over $50', 'Easy 30-day returns', 'Quality guaranteed'],
    features: [['Built to last', 'We stock durable goods that earn their place in your life.'], ['Honest prices', 'Fair pricing on the things you actually want, no gimmicks.'], ['Fast, free shipping', 'Orders over the threshold ship free and arrive quickly.'], ['Easy returns', 'Changed your mind? Send it back within 30 days, no hassle.'], ['Real recommendations', 'Our team uses what we sell and helps you pick right.'], ['Secure checkout', 'Shop with confidence on a fast, protected checkout.']],
    servicesHead: ['Shop the collections', 'Curated goods chosen for quality, not clutter.'],
    services: [['New Arrivals', 'The latest pieces, fresh off the truck. Be the first to grab the drop.'], ['Best Sellers', 'The favorites our customers keep coming back for, proven and popular.'], ['Essentials', 'Everyday staples that never let you down. Stock up on the basics done right.'], ['Seasonal', 'Pieces picked for the season, here for a limited time.'], ['Gifts', 'Thoughtful finds for everyone on your list, ready to give.'], ['Sale', 'Great gear at even better prices while it lasts.']],
    servicesCta: ['Not sure where to start?', 'Browse best sellers or reach out and we will point you the right way.'],
    statsHead: 'Loved by thousands of customers',
    stats: [['10k+ Orders', 'shipped and counting'], ['4.8 Stars', 'from real reviews'], ['30-Day', 'easy returns'], ['Fast', 'free shipping over $50']],
    process: [['Browse', 'Explore curated collections built around quality.'], ['Choose', 'Pick what fits, with honest details on every product.'], ['Checkout', 'Fast, secure, and simple, every time.'], ['Enjoy', 'Get it fast, and love it or return it easily.']],
    faqHead: ['Shopping questions', 'Everything about orders, shipping, and returns.'],
    faqs: [['How much is shipping?', 'Shipping is free on orders over the threshold. Smaller orders ship at a flat, fair rate.'], ['What is your return policy?', 'If it is not right, send it back within 30 days for a refund or exchange. No hassle.'], ['How fast will my order arrive?', 'Most orders ship within a business day and arrive quickly, with tracking every step of the way.'], ['Do you restock sold-out items?', 'Often, yes. Sign up for restock alerts on any product and we will let you know the moment it is back.']],
    cta: ['Find your new favorite', 'Shop quality goods at honest prices, with free shipping and easy returns.', 'Shop now'],
    about: ['Gear we actually stand behind', 'We got tired of flimsy products and inflated prices, so we built a shop around quality and straight talk. We only sell what we would use ourselves.', 'What we believe', 'Buy better, buy less. Great products, fair prices, and service that treats you like a person, not an order number.'],
    meta: ['Quality goods at honest prices with free shipping over $50 and easy 30-day returns. Shop new arrivals and best sellers.', 'Shop our collections: new arrivals, best sellers, essentials, seasonal picks, gifts, and sale items.'],
  },
  saas: {
    hero: ['Ship faster with less busywork', 'The platform that handles the tedious parts so your team can focus on the work that matters. Set up in minutes, not weeks.', 'Start free trial', 'See how it works'],
    badges: ['Free 14-day trial', 'No credit card required', 'Cancel anytime'],
    features: [['Fast setup', 'Connect your tools and go live in minutes, not weeks.'], ['Built to scale', 'From your first user to your millionth, performance stays steady.'], ['Secure by default', 'Encryption, access controls, and audit logs come standard.'], ['Automations', 'Replace repetitive manual steps with reliable, hands-off workflows.'], ['Clear analytics', 'See what is working with dashboards your whole team understands.'], ['Helpful support', 'Real humans who answer fast when you need them.']],
    servicesHead: ['What you can do', 'Everything you need to move faster, in one place.'],
    services: [['Workflow Automation', 'Turn manual, repetitive tasks into reliable automated flows. Save hours every week without writing code.'], ['Team Collaboration', 'Keep everyone aligned with shared views, comments, and real-time updates.'], ['Analytics & Reporting', 'Track the numbers that matter with dashboards anyone can read.'], ['Integrations', 'Connect the tools you already use so your data flows in one direction: forward.'], ['Access Controls', 'Give the right people the right access with roles and permissions.'], ['API & Webhooks', 'Build on top of the platform with a clean, well-documented API.']],
    servicesCta: ['Ready to see it in action?', 'Start a free trial or book a quick demo with our team.'],
    statsHead: 'Trusted by growing teams',
    stats: [['10k+ Teams', 'building with us'], ['99.9% Uptime', 'you can rely on'], ['5 Min', 'to get started'], ['24/7', 'support that responds']],
    process: [['Sign up', 'Create your account free, no card required.'], ['Connect', 'Link your existing tools in a few clicks.'], ['Automate', 'Set up flows that run the busywork for you.'], ['Grow', 'Watch your team move faster with less friction.']],
    faqHead: ['Questions teams ask', 'The details before you start.'],
    faqs: [['Is there really a free trial?', 'Yes. You get a full 14-day trial with no credit card required, so you can try everything first.'], ['How long does setup take?', 'Most teams are up and running in minutes. Connect your tools, invite your team, and go.'], ['Is my data secure?', 'Security is built in, with encryption, access controls, and audit logs standard on every plan.'], ['Can I cancel anytime?', 'Of course. There are no long-term contracts, and you can upgrade, downgrade, or cancel whenever you like.']],
    cta: ['Start building today', 'Try it free for 14 days. No credit card, no risk, just less busywork.', 'Start free trial'],
    about: ['Software that respects your time', 'We build tools that get out of the way. Instead of adding more dashboards to check, we automate the work you never wanted to do by hand.', 'Our approach', 'Simple to start, powerful when you need it, and honest about pricing. Great software should save time, not steal it.'],
    meta: ['A platform that automates busywork so your team ships faster. Free 14-day trial, no credit card, cancel anytime.', 'Explore features: workflow automation, collaboration, analytics, integrations, access controls, and a developer API.'],
  },
  agency: {
    hero: ['Ideas that move the needle', 'We design brands and campaigns that get noticed and get results. Strategy first, beautiful work always.', 'Start a project', 'See our work'],
    badges: ['Results-driven', 'Senior team, no handoffs', 'Clear, fixed scopes'],
    features: [['Strategy first', 'We start with your goals, not a template, so the work actually performs.'], ['Senior talent', 'Experienced people do your work directly, start to finish.'], ['Measurable results', 'We tie creative to outcomes and report on what moves.'], ['On time, on scope', 'Clear timelines and fixed scopes, so there are no surprises.'], ['Full-service', 'Brand, web, and campaigns handled under one roof.'], ['True partnership', 'We act like an extension of your team, not a vendor.']],
    servicesHead: ['What we do', 'Strategy, design, and campaigns that work together.'],
    services: [['Brand Identity', 'Logos, systems, and voice that make you unmistakable. We build brands that last, not trends that fade.'], ['Web Design & Build', 'Fast, beautiful sites that turn visitors into customers. Designed to convert, built to scale.'], ['Marketing Campaigns', 'Full-funnel campaigns that get attention and drive action across every channel.'], ['Content & Social', 'Content people actually want, planned and produced to grow your audience.'], ['SEO & Growth', 'Sustainable growth built on real search demand, not shortcuts.'], ['Creative Direction', 'A guiding vision that keeps every piece sharp, consistent, and on brand.']],
    servicesCta: ['Have a project in mind?', 'Tell us your goals and we will map a plan to hit them.'],
    statsHead: 'Work that delivers',
    stats: [['200+ Projects', 'shipped for clients'], ['15+ Years', 'of combined craft'], ['3x Avg', 'return on campaigns'], ['Senior', 'team on every project']],
    process: [['Discover', 'We dig into your goals, audience, and market.'], ['Design', 'We craft strategy and creative built to perform.'], ['Launch', 'We ship polished work on time and on scope.'], ['Measure', 'We track results and refine what works.']],
    faqHead: ['Working with us', 'The answers clients want up front.'],
    faqs: [['How much does a project cost?', 'It depends on scope, but every engagement has a clear, fixed price agreed up front. No surprise invoices.'], ['How long will it take?', 'We share a realistic timeline before we start and hit it. Most brand and web projects run a few weeks to a couple of months.'], ['Who actually does the work?', 'Senior specialists handle your project directly. There are no junior handoffs behind the scenes.'], ['Do you work with our in-house team?', 'Often, yes. We plug in as an extension of your team and hand off cleanly when the work is done.']],
    cta: ['Let us build something great', 'Tell us about your project and we will show you how we can help.', 'Start a project'],
    about: ['A studio built on results', 'We are a small team of senior designers, strategists, and marketers who care about outcomes as much as aesthetics. Beautiful work that does not perform is just decoration.', 'How we think', 'Strategy before style, results before awards, and honesty at every step. We win when you win.'],
    meta: ['A results-driven creative agency offering brand identity, web design, marketing campaigns, content, and SEO.', 'Our services: brand identity, web design, marketing campaigns, content and social, SEO, and creative direction.'],
  },
  portfolio: {
    hero: ['Work I am proud to share', 'I craft thoughtful, polished projects that help brands and people stand out. Take a look, then let us make something together.', 'View my work', 'Get in touch'],
    badges: ['Available for projects', 'Fast, clear communication', 'Detail-obsessed'],
    features: [['Craft over hype', 'I sweat the details so the final work feels effortless.'], ['Clear process', 'You always know where a project stands and what comes next.'], ['Reliable delivery', 'I hit deadlines and communicate early if anything shifts.'], ['Tailored, not templated', 'Every project starts from your goals, never a canned formula.'], ['Easy to work with', 'Straight talk, quick replies, and zero ego.'], ['Built to last', 'Work made to hold up long after launch day.']],
    servicesHead: ['What I make', 'A focused set of things I do really well.'],
    services: [['Design', 'Clean, purposeful design that communicates clearly and looks the part. Form that follows the goal.'], ['Photography', 'Striking, story-driven images that capture the real thing, beautifully.'], ['Branding', 'Identities with a point of view, built to be remembered.'], ['Web Projects', 'Fast, elegant sites that feel as good as they look.'], ['Consulting', 'A second set of expert eyes to sharpen your work and direction.'], ['Collaborations', 'I love teaming up with good people on ambitious projects.']],
    servicesCta: ['Have something in mind?', 'Tell me about your project and I will let you know how I can help.'],
    statsHead: 'A bit of proof',
    stats: [['120+ Projects', 'delivered'], ['10+ Years', 'honing the craft'], ['Repeat', 'clients who come back'], ['Available', 'for new work now']],
    process: [['Connect', 'Tell me about your project and goals.'], ['Plan', 'I map a clear scope, timeline, and price.'], ['Create', 'I do the work with care and keep you posted.'], ['Deliver', 'You get polished, ready-to-use results.']],
    faqHead: ['Before we start', 'The things people usually ask.'],
    faqs: [['Are you available for new projects?', 'Yes, I am currently taking on new work. Reach out and let us find a time to talk.'], ['How do you price your work?', 'I scope each project individually and give you a clear, fixed quote before we begin.'], ['What is your turnaround?', 'It depends on the project, but I share a realistic timeline up front and keep you updated throughout.'], ['Do you work remotely?', 'Absolutely. I work with clients anywhere and keep communication clear and easy from start to finish.']],
    cta: ['Let us make something great', 'I am available for new projects. Tell me what you have in mind and let us talk.', 'Get in touch'],
    about: ['Hi, I am glad you are here', 'I am an independent maker who cares deeply about craft and the people I work with. I take on a handful of projects at a time so each one gets my full attention.', 'What drives me', 'The joy of making something genuinely good, and the trust of a client who is thrilled with the result. That is the whole job.'],
    meta: ['An independent designer and maker crafting thoughtful design, photography, branding, and web projects. Available now.', 'What I offer: design, photography, branding, web projects, consulting, and collaborations. Currently available.'],
  },
};

function pack(v) {
  const s = V[v];
  const o = {};
  const [hh, hs, hc, hsc] = s.hero;
  o.HERO_HEADLINE = hh; o.HERO_SUBHEADLINE = hs; o.HERO_CTA = hc; o.HERO_SECONDARY_CTA = hsc;
  s.badges.forEach((b, i) => { o[`TRUST_BADGE_${i + 1}`] = b; });
  s.features.forEach(([t, d], i) => { o[`FEATURE_${i + 1}_TITLE`] = t; o[`FEATURE_${i + 1}_DESCRIPTION`] = d; });
  o.SERVICES_HEADLINE = s.servicesHead[0]; o.SERVICES_SUBHEADLINE = s.servicesHead[1];
  s.services.forEach(([t, d], i) => { o[`SERVICE_${i + 1}_TITLE`] = t; o[`SERVICE_${i + 1}_FULL_DESCRIPTION`] = d; });
  o.SERVICES_CTA_HEADLINE = s.servicesCta[0]; o.SERVICES_CTA_DESCRIPTION = s.servicesCta[1];
  o.STATS_HEADLINE = s.statsHead;
  s.stats.forEach(([l, c], i) => { o[`STAT_${i + 1}_LABEL`] = l; o[`STAT_${i + 1}_CAPTION`] = c; });
  s.process.forEach(([t, d], i) => { o[`PROCESS_${i + 1}_TITLE`] = t; o[`PROCESS_${i + 1}_DESCRIPTION`] = d; });
  o.FAQ_HEADLINE = s.faqHead[0]; o.FAQ_SUBHEADLINE = s.faqHead[1];
  s.faqs.forEach(([q, a], i) => { o[`FAQ_${i + 1}_Q`] = q; o[`FAQ_${i + 1}_A`] = a; });
  o.CTA_HEADLINE = s.cta[0]; o.CTA_DESCRIPTION = s.cta[1]; o.CTA_BUTTON = s.cta[2];
  o.ABOUT_HEADLINE = s.about[0]; o.ABOUT_DESCRIPTION = s.about[1]; o.ABOUT_MISSION_HEADLINE = s.about[2]; o.ABOUT_MISSION_TEXT = s.about[3];
  o.ABOUT_META_DESCRIPTION = s.meta[0]; o.SERVICES_META_DESCRIPTION = s.meta[1];
  return o;
}

let count = 0;
for (const v of Object.keys(V)) {
  const file = path.join(OUT, `_content.${v}.json`);
  fs.writeFileSync(file, JSON.stringify(pack(v), null, 2) + '\n');
  count++;
  console.log(`wrote _content.${v}.json (${Object.keys(pack(v)).length} tokens)`);
}
console.log(`\n${count} content packs generated.`);
