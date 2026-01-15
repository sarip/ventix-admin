-- ======================
-- 1. events_cat
-- ======================
INSERT INTO events_cat (name, description) VALUES
('Esport', 'Turnamen game kompetitif online dan offline'),
('Seminar', 'Acara edukasi dengan pembicara ahli'),
('Workshop', 'Pelatihan praktis dan interaktif'),
('Music', 'Konser musik dan festival festival'),
('Festival', 'Perayaan budaya atau pameran besar');

-- ======================
-- 2. events_status
-- ======================
INSERT INTO events_status (name, description) VALUES
('draft', 'Event masih dalam tahap perencanaan'),
('upcoming', 'Pendaftaran dibuka / segera hadir'),
('ongoing', 'Event sedang berlangsung'),
('finished', 'Event telah selesai dilaksanakan');

-- ======================
-- 3. events_organizer
-- ======================
INSERT INTO events_organizer (eo_name, company_name, email, phone, website, address, eo_slug, tax_id) VALUES
('Indo Esport Hub', 'PT. Digital Gaming Indonesia', 'info@indoesport.com', '021-555123', 'indoesport.com', 'Jakarta Selatan', 'indo-esport', '01.234.567.8-001.000'),
('Creative Media', 'CV. Karya Kreatif', 'hello@creativemedia.id', '021-555987', 'creativemedia.id', 'Bandung', 'creative-media', '02.111.222.3-002.000'),
('Tech Talks ID', 'PT. Teknologi Edukasi', 'admin@techtalks.id', '021-444333', 'techtalks.id', 'Yogyakarta', 'tech-talks', '03.999.888.7-003.000'),
('Melody Pro', 'Melody Production House', 'event@melodypro.com', '0812345678', 'melodypro.com', 'Surabaya', 'melody-pro', '04.777.666.5-004.000'),
('Global Expo', 'PT. Pameran Dunia', 'support@globalexpo.id', '021-888777', 'globalexpo.id', 'Tangerang', 'global-expo', '05.555.444.3-005.000');

-- ======================
-- 4. events
-- ======================
INSERT INTO events (events_organizer_id, user_id_pic, event_category, title, description, start_date, end_date, location_name, latitude, longitude, price_pool, registration_fee, events_status) VALUES
(1, 101, 'Esport', 'Mobile Legends Championship', 'Turnamen MLBB tingkat nasional', '2025-01-10 10:00', '2025-01-12 21:00', 'Istora Senayan', '-6.2183', '106.8021', 50000000.00, 150000.00, 'upcoming'),
(1, 101, 'Esport', 'Valorant Pro League', 'Liga profesional Valorant Indonesia', '2025-02-15 13:00', '2025-02-20 20:00', 'Gaming Arena', '-6.2000', '106.8166', 75000000.00, 200000.00, 'upcoming'),
(2, 102, 'Workshop', 'Photography 101', 'Belajar dasar fotografi dengan kamera DSLR', '2024-12-01 09:00', '2024-12-01 15:00', 'Bandung Studio', '-6.9175', '107.6191', 0.00, 350000.00, 'finished'),
(2, 102, 'Seminar', 'UI/UX Design Trend 2025', 'Seminar mengenai tren desain masa depan', '2025-01-20 14:00', '2025-01-20 17:00', 'Zoom Meeting', '0', '0', 0.00, 50000.00, 'upcoming'),
(3, 103, 'Seminar', 'AI for Productivity', 'Cara memanfaatkan AI untuk kerja sehari-hari', '2025-03-05 09:00', '2025-03-05 12:00', 'Grand Hyatt Jakarta', '-6.1923', '106.8227', 0.00, 750000.00, 'draft'),
(4, 104, 'Music', 'Jazz Night In Jakarta', 'Konser Jazz eksklusif', '2024-12-29 19:00', '2024-12-29 23:00', 'JIEXPO Hall D', '-6.1519', '106.8451', 0.00, 1200000.00, 'ongoing'),
(5, 105, 'Festival', 'Indonesia Culinary Expo', 'Pameran makanan tradisional terbesar', '2025-05-10 10:00', '2025-05-15 22:00', 'ICE BSD', '-6.3006', '106.6387', 0.00, 25000.00, 'upcoming'),
(1, 101, 'Esport', 'PUBG Mobile Rookie Cup', 'Khusus untuk pemain amatir', '2025-01-05 10:00', '2025-01-05 20:00', 'Cyber Café', '-6.2000', '106.8000', 10000000.00, 50000.00, 'upcoming'),
(2, 102, 'Workshop', 'Copywriting Masterclass', 'Menulis iklan yang menjual', '2025-02-10 09:00', '2025-02-11 16:00', 'Creative Hub JKT', '-6.2200', '106.8100', 0.00, 1500000.00, 'upcoming'),
(3, 103, 'Seminar', 'Data Science for Business', 'Implementasi Big Data di industri', '2024-11-20 10:00', '2024-11-20 15:00', 'Webinar Space', '0', '0', 0.00, 0.00, 'finished'),
(4, 104, 'Music', 'Rock Fest 2025', 'Festival musik rock lokal', '2025-06-12 15:00', '2025-06-13 23:59', 'Stadion Madya', '-6.2166', '106.8019', 0.00, 450000.00, 'upcoming'),
(5, 105, 'Festival', 'Anime World ID', 'Festival budaya Jepang dan Anime', '2025-07-20 10:00', '2025-07-21 21:00', 'Balai Kartini', '-6.2349', '106.8229', 5000000.00, 100000.00, 'upcoming'),
(1, 101, 'Esport', 'Dota 2 Community Clash', 'Turnamen komunitas mingguan', '2024-12-30 18:00', '2024-12-30 22:00', 'Online', '0', '0', 2000000.00, 20000.00, 'ongoing'),
(2, 102, 'Workshop', 'Digital Marketing 2025', 'Strategi marketing terbaru', '2025-04-12 09:00', '2025-04-12 17:00', 'Wisma Atlet Hall', '-6.1500', '106.8600', 0.00, 500000.00, 'upcoming'),
(3, 103, 'Seminar', 'Career Talk: Tech Jobs', 'Membangun karir di dunia teknologi', '2025-01-15 13:00', '2025-01-15 16:00', 'Auditorium UI', '-6.3606', '106.8273', 0.00, 0.00, 'upcoming'),
(4, 104, 'Music', 'Pop Star Concert', 'Artis internasional papan atas', '2025-09-09 19:00', '2025-09-09 22:00', 'SICC Bogor', '-6.5587', '106.8272', 0.00, 2500000.00, 'upcoming'),
(5, 105, 'Festival', 'Tech Expo Indonesia', 'Pameran gadget dan teknologi', '2025-08-01 10:00', '2025-08-05 21:00', 'JCC Senayan', '-6.2147', '106.8077', 0.00, 35000.00, 'upcoming'),
(1, 101, 'Esport', 'Free Fire Winter Cup', 'Turnamen akhir tahun', '2024-12-25 08:00', '2024-12-27 20:00', 'Mall Taman Anggrek', '-6.1785', '106.7922', 20000000.00, 100000.00, 'finished'),
(2, 102, 'Workshop', 'Pottery Class', 'Seni membuat keramik', '2025-01-18 10:00', '2025-01-18 13:00', 'Clay Studio', '-6.2500', '106.7800', 0.00, 400000.00, 'upcoming'),
(3, 103, 'Seminar', 'Healthy Life 2025', 'Gaya hidup sehat di era digital', '2025-02-05 09:00', '2025-02-05 12:00', 'Rumah Sakit Pondok Indah', '-6.2842', '106.7828', 0.00, 150000.00, 'draft'),
(4, 104, 'Music', 'Indie Soundscapes', 'Panggung musik musisi indie', '2025-03-20 16:00', '2025-03-20 23:00', 'Taman Ismail Marzuki', '-6.1901', '106.8374', 0.00, 150000.00, 'upcoming'),
(5, 105, 'Festival', 'Auto Show 2025', 'Pameran mobil terbaru', '2025-10-10 10:00', '2025-10-20 21:00', 'ICE BSD', '-6.3006', '106.6387', 0.00, 50000.00, 'upcoming'),
(1, 101, 'Esport', 'Chess Online Battle', 'Catur online berhadiah', '2025-01-08 19:00', '2025-01-08 22:00', 'Lichess.org', '0', '0', 5000000.00, 0.00, 'upcoming'),
(2, 102, 'Workshop', 'Public Speaking 101', 'Berani bicara di depan umum', '2024-10-10 09:00', '2024-10-10 17:00', 'Hotel Horison', '-6.9200', '107.6000', 0.00, 850000.00, 'finished'),
(3, 103, 'Seminar', 'Startup Founders Talks', 'Diskusi bersama founder unicorn', '2025-04-15 13:00', '2025-04-15 16:00', 'BLOCK71 Jakarta', '-6.2200', '106.8000', 0.00, 0.00, 'upcoming'),
(4, 104, 'Music', 'EDM Party Night', 'Party bersama DJ lokal', '2024-12-31 21:00', '2025-01-01 03:00', 'Club SCBD', '-6.2267', '106.8094', 0.00, 300000.00, 'upcoming'),
(5, 105, 'Festival', 'Book Fair 2025', 'Pesta buku murah', '2025-06-01 09:00', '2025-06-10 21:00', 'Tunjungan Plaza', '-7.2624', '112.7388', 0.00, 0.00, 'upcoming'),
(1, 101, 'Esport', 'Street Fighter Tournament', 'Game fighting klasik', '2025-01-25 11:00', '2025-01-25 18:00', 'Neo Soho Mall', '-6.1748', '106.7905', 3000000.00, 75000.00, 'upcoming'),
(2, 102, 'Workshop', 'Pastry Baking', 'Membuat roti dan kue', '2025-03-12 08:00', '2025-03-12 12:00', 'Kitchen Academy', '-6.2000', '106.8500', 0.00, 600000.00, 'upcoming'),
(3, 103, 'Seminar', 'Cyber Security Awareness', 'Melindungi data pribadi', '2025-05-20 10:00', '2025-05-20 12:00', 'Zoom', '0', '0', 0.00, 0.00, 'upcoming');

-- ======================
-- 5. events_agendas
-- ======================
INSERT INTO events_agendas (events_id, start_time, end_time, activity_name, notes) VALUES
-- 1. Mobile Legends Championship
(1, '09:00', '10:00', 'Registration & Tech Check', 'Verifikasi identitas dan pengecekan smartphone peserta'),
(1, '10:00', '10:30', 'Opening Ceremony', 'Sambutan EO dan penampilan pembuka (Dance)'),
(1, '10:30', '12:00', 'Group Stage: Round 1', 'Pertandingan serentak Pool A dan B'),
(1, '12:00', '13:00', 'Lunch Break', 'Istirahat dan maintenance server'),
(1, '13:00', '15:30', 'Group Stage: Round 2', 'Penentuan pemuncak klasemen grup'),
(1, '15:30', '16:00', 'Coffee Break', 'Sesi foto tim di media zone'),
(1, '16:00', '19:00', 'Quarter Finals', 'Eliminasi pertama babak knockout'),
(1, '19:00', '21:00', 'Day 1 Wrap-up', 'Analisa statistik pemain oleh shoutcaster'),
-- 2. Valorant Pro League
(2, '13:00', '14:00', 'Technical Meeting', 'Map veto dan penentuan side'),
(2, '14:00', '17:00', 'Lower Bracket Match', 'Best of 3 (BO3)'),
(2, '17:30', '20:00', 'Upper Bracket Final', 'Penentuan tiket Grand Final'),
-- 3. Photography 101
(3, '08:00', '08:30', 'Arrival & Welcome Drink', 'Pembagian modul dan name tag'),
(3, '08:30', '09:30', 'Theory: Shutter & Aperture', 'Dasar eksposur untuk pemula'),
(3, '09:30', '10:30', 'Theory: ISO & White Balance', 'Keseimbangan warna di berbagai kondisi cahaya'),
(3, '10:30', '10:45', 'Short Break', 'Snack and tea time'),
(3, '10:45', '12:00', 'Composition Masterclass', 'Rule of thirds, golden ratio, dan framing'),
(3, '12:00', '13:00', 'Lunch Break', 'Networking antar fotografer'),
(3, '13:00', '14:30', 'Practice: Portrait Model', 'Sesi foto outdoor dengan model profesional'),
(3, '14:30', '15:00', 'Photo Editing & Submission', 'Tips editing cepat di Lightroom Mobile'),
-- 4. UI/UX Design Trend 2025
(4, '14:00', '15:00', 'Keynote: Design for Accessibility', 'Tren aksesibilitas digital masa depan'),
(4, '15:00', '16:00', 'Workshop: Prototyping AI', 'Membuat prototype menggunakan tool AI terbaru'),
(4, '16:00', '17:00', 'Networking Session', 'Sesi tanya jawab dan tukar portofolio'),
-- 5. AI for Productivity
(5, '08:30', '09:00', 'Check-in & Software Setup', 'Aktivasi akun premium trial peserta'),
(5, '09:00', '10:00', 'Intro: AI Ecosystem 2025', 'Perkembangan AI dalam industri kreatif'),
(5, '10:00', '11:00', 'Hands-on: Prompt Engineering', 'Latihan menulis prompt untuk hasil presisi'),
(5, '11:00', '11:30', 'Q&A Session', 'Tanya jawab interaktif'),
(5, '11:30', '12:00', 'Networking & Closing', 'Penyerahan sertifikat digital via email'),
-- 6. Jazz Night In Jakarta
(6, '19:00', '20:00', 'Opening: Jazz Community', 'Penampilan bakat muda jazz lokal'),
(6, '20:00', '21:30', 'Main Set: Jazz Legends', 'Penampilan utama bintang tamu jazz'),
(6, '21:30', '23:00', 'Late Night Jam Session', 'Kolaborasi bebas antar musisi'),
-- 7. Indonesia Culinary Expo
(7, '10:00', '11:00', 'Grand Opening', 'Pemotongan pita oleh tamu kehormatan'),
(7, '11:00', '13:00', 'Chef Demo: Modern Satay', 'Inovasi menu sate oleh Chef Guest Star'),
(7, '13:00', '14:00', 'Live Music: Gamelan Modern', 'Hiburan di panggung utama'),
(7, '14:00', '16:00', 'Cooking Competition', 'Babak penyisihan lomba masak antar mahasiswa'),
(7, '16:00', '18:00', 'Spice Tasting Session', 'Edukasi rempah-rempah asli Indonesia'),
(7, '18:00', '21:00', 'Night Market', 'Eksplorasi 50+ booth kuliner'),
-- 8. PUBG Mobile Rookie Cup
(8, '10:00', '11:00', 'Player Briefing', 'Penjelasan rule point dan zona'),
(8, '11:00', '15:00', 'Match Day 1-3', 'Peta Erangel & Miramar'),
(8, '16:00', '19:00', 'Match Day 4-6', 'Peta Sanhok & Vikendi'),
(8, '19:00', '20:00', 'Prizing', 'Penyerahan trophy pemenang'),
-- 9. Copywriting Masterclass
(9, '09:00', '10:30', 'Psychology of Selling', 'Materi dasar copywriting persuasif'),
(9, '10:30', '12:00', 'Headline & Hook Workshop', 'Latihan membuat judul iklan yang menarik'),
(9, '13:00', '15:00', 'Direct Response Copy', 'Praktek menulis email marketing'),
(9, '15:00', '16:00', 'Review & Feedback', 'Koreksi tulisan peserta secara langsung'),
-- 10. Data Science for Business
(10, '10:00', '10:45', 'Keynote: Data Mindset', 'Mengubah intuisi menjadi keputusan berbasis data'),
(10, '10:45', '11:30', 'Case Study: Retail Analytics', 'Analisis pola belanja konsumen di supermarket'),
(10, '11:30', '13:00', 'Lunch Break & Networking', 'Makan siang dan diskusi antar pemilik bisnis'),
(10, '13:00', '14:30', 'Workshop: Predictive Modeling', 'Simulasi menggunakan Python/Excel untuk prediksi sales'),
(10, '14:30', '15:00', 'Q&A and Strategy Wrap-up', 'Diskusi panel mengenai implementasi AI di bisnis'),
-- 11. Rock Fest 2025
(11, '15:00', '16:30', 'Opening: Emerging Rock Bands', 'Performance 3 band rock lokal pilihan'),
(11, '16:30', '17:00', 'Stage Preparation', 'Setting alat untuk band legendaris'),
(11, '17:00', '18:30', 'Main Act Part 1: Classic Rock', 'Penampilan lagu-lagu hits era 90-an'),
(11, '18:30', '19:30', 'Maghrib Break & Chill', 'Jeda istirahat dan kunjungan ke booth merch'),
(11, '19:30', '21:00', 'Main Act Part 2: Hard Rock', 'Performance band rock nasional papan atas'),
(11, '21:00', '23:30', 'Headliner Show', 'Final performance oleh artis internasional'),
(11, '23:30', '23:59', 'Grand Finale & Fireworks', 'Penutupan acara dengan pesta kembang api'),
-- 12. Anime World ID
(12, '10:00', '11:00', 'Open Gate & DJ Performance', 'J-Pop & Anime mix session'),
(12, '11:00', '12:00', 'Coswalk Competition', 'Parade kostum (Catwalk di stage)'),
(12, '12:00', '13:30', 'Anisong Karaoke Contest', 'Kompetisi menyanyi lagu anime'),
(12, '13:30', '14:30', 'Talkshow: Seiyuu World', 'Berbagi pengalaman dubbing anime'),
(12, '14:30', '16:30', 'Cosplay Skit', 'Penampilan drama bertema anime'),
(12, '16:30', '18:00', 'J-Pop Dance Cover', 'Kompetisi grup dance cover'),
(12, '19:00', '21:00', 'Guest Star Concert', 'Performance band pengisi soundtrack anime'),
-- 13. Dota 2 Community Clash
(13, '18:00', '19:00', 'Semifinal Match A', 'Best of 1 (BO1) - Area Dire vs Radiant'),
(13, '19:00', '20:00', 'Semifinal Match B', 'Best of 1 (BO1) - Penentuan lawan final'),
(13, '20:00', '20:30', 'Analysis Session', 'Bedah strategi dan draft hero dari analis esports'),
(13, '20:30', '22:00', 'Grand Final BO3', 'Pertandingan penentuan juara komunitas'),
-- 14. Digital Marketing 2025
(14, '09:00', '10:30', 'SEO Trends in AI Era', 'Strategi konten agar tetap relevan di Google SGE'),
(14, '10:30', '12:00', 'TikTok & IG Reels Mastery', 'Algoritma video pendek di tahun 2025'),
(14, '12:00', '13:00', 'Lunch & Networking', 'Sesi tukar kartu nama (B2B)'),
(14, '13:00', '14:30', 'Ad Strategy: Meta vs TikTok', 'Membandingkan ROI iklan di berbagai platform'),
(14, '14:30', '16:00', 'CRM & Automation', 'Menjaga loyalitas pelanggan secara otomatis'),
(14, '16:00', '17:00', 'Agency Insights', 'Studi kasus sukses campaign miliaran rupiah'),
-- 15. Career Talk: Tech Jobs
(15, '13:00', '13:45', 'CV Building: ATS Optimized', 'Tips menembus sistem screening otomatis perusahaan tech'),
(15, '13:45', '14:30', 'Mock Interview: Behavioral', 'Simulasi interview dengan HRD (STAR method)'),
(15, '14:30', '15:15', 'Mock Interview: Technical', 'Simulasi whiteboard interview untuk developer'),
(15, '15:15', '16:00', 'Tech Career Roadmap 2025', 'Diskusi peluang kerja AI, DevOps, dan Cyber Security'),
-- 16. Pop Star Concert
(16, '19:00', '19:45', 'Opening Act: Acoustic Pop', 'Performance musisi lokal pembuka'),
(16, '19:45', '20:15', 'Intermission & Safety Briefing', 'Pengecekan keamanan penonton dan jeda teknis'),
(16, '20:15', '22:00', 'Main Concert: Pop Star', 'Full setlist 20 lagu hits dan visual laser show'),
-- 17. Tech Expo Indonesia
(17, '10:00', '11:00', 'Startup Pitching: Fintech', 'Presentasi 5 startup bidang keuangan'),
(17, '11:00', '12:00', 'Startup Pitching: Green Tech', 'Inovasi teknologi ramah lingkungan'),
(17, '12:00', '13:00', 'VIP Hall Tour', 'Kunjungan media dan tamu VVIP'),
(17, '13:00', '17:00', 'Expo Hall: Interactive Demo', 'Mencoba gadget VR dan robotika terbaru'),
(17, '17:00', '21:00', 'Networking Night', 'Sesi networking pelaku industri tech'),
-- 18. Free Fire Winter Cup
(18, '08:00', '10:00', 'Qualifier: Group Stage A', 'Pertandingan kualifikasi wilayah barat'),
(18, '10:00', '12:00', 'Qualifier: Group Stage B', 'Pertandingan kualifikasi wilayah timur'),
(18, '12:00', '13:30', 'Stage Refresh & Lunch', 'Istirahat dan persiapan panggung utama'),
(18, '13:30', '19:00', 'Main Stage Grand Finals', 'Battle 12 tim terbaik nasional (6 Round)'),
(18, '19:00', '20:00', 'Awarding & MVP Announcement', 'Penyerahan trophy dan gelar pemain terbaik'),
-- 19. Pottery Class
(19, '10:00', '10:30', 'Clay Theory', 'Mengenal jenis tanah liat dan kadar air'),
(19, '10:30', '11:30', 'Wheel Throwing: Basic Cylinder', 'Praktek membuat bentuk silinder dasar'),
(19, '11:30', '12:30', 'Shaping & Trimming', 'Memberikan detail bentuk dan merapikan alas'),
(19, '12:30', '13:00', 'Drying Preparation', 'Instruksi proses pembakaran (firing)'),
-- 20. Healthy Life 2025
(20, '09:00', '09:45', 'Morning Yoga & Meditation', 'Pemanasan dan relaksasi pikiran'),
(20, '10:00', '10:45', 'Seminar: Clean Eating', 'Cara memilih bahan makanan organik'),
(20, '11:00', '12:00', 'Health Screening Station', 'Cek gula darah, kolesterol, dan tekanan darah'),
-- 21. Indie Soundscapes
(21, '16:00', '17:30', 'Acoustic Stage: Folk Session', 'Penampilan musisi folk indie lokal'),
(21, '17:30', '18:30', 'Sunset Break', 'Jeda maghrib dan aktivitas food truck'),
(21, '19:00', '21:00', 'Indie Full Band: Synth Wave', 'Performance band indie aliran elektronik'),
(21, '21:00', '23:00', 'Headliner: Indie Pop Rock', 'Penampilan puncak musisi indie nasional'),
-- 22. Auto Show 2025 (Festival Otomotif)
(22, '10:00', '11:00', 'Grand Opening & Ribbon Cutting', 'Pembukaan oleh Asosiasi Otomotif Indonesia'),
(22, '11:00', '13:00', 'EV Showcase: Future Mobility', 'Presentasi teknologi baterai dan otonom terbaru'),
(22, '13:00', '14:00', 'Lunch Break & VIP Networking', 'Istirahat di Lounge utama'),
(22, '14:00', '17:00', 'Test Drive Session', 'Slot terbatas, pendaftaran via booth masing-masing brand'),
(22, '17:00', '18:30', 'Modification Talkshow', 'Sharing session bersama modifikator profesional'),
(22, '18:30', '20:30', 'Modification Contest Judging', 'Penjurian unit modifikasi di main hall'),
(22, '20:30', '21:00', 'Awarding Night', 'Pengumuman pemenang Best of Show'),
-- 23. Chess Online Battle (E-Sport)
(23, '18:30', '19:00', 'Technical Meeting & Pairings', 'Verifikasi akun Lichess/Chess.com peserta'),
(23, '19:00', '20:30', 'Swiss System (Rounds 1-5)', 'Catur cepat 10+5. Pemain wajib on-cam (Zoom)'),
(23, '20:30', '21:00', 'Analysis Break', 'Analisa grandmaster terhadap game terbaik ronde awal'),
(23, '21:00', '22:00', 'Knockout Playoff & Final', 'Sistem Sudden Death untuk penentuan juara'),
-- 24. Public Speaking 101 (Workshop)
(24, '09:00', '10:30', 'Session 1: Mindset & Nerves', 'Memahami sumber kecemasan dan teknik pernapasan'),
(24, '10:30', '10:45', 'Morning Coffee Break', 'Coffee and snack networking'),
(24, '10:45', '12:00', 'Session 2: Vocal Power & Body Language', 'Praktek intonasi, gestur tangan, dan kontak mata'),
(24, '12:00', '13:00', 'Lunch Break', 'Ishoma'),
(24, '13:00', '15:30', 'Persuasive Speech Practice', 'Setiap peserta pidato 3 menit di depan kamera & ring light'),
(24, '15:30', '17:00', 'Video Review & Individual Feedback', 'Evaluasi hasil rekaman bersama mentor'),
-- 25. Startup Founders Talks (Business)
(25, '13:00', '14:00', 'Fireside Chat: Scaling Up', 'Bagaimana mengelola tim dari 10 ke 100 orang'),
(25, '14:00', '14:30', 'Q&A Audience Session', 'Sesi tanya jawab langsung dengan Founder Unicorn'),
(25, '14:30', '15:30', 'Speed Networking', 'Sesi 5 menit bertukar ide antar peserta dan investor'),
(25, '15:30', '16:00', 'Closing Remarks & Photo Session', 'Penutupan dan dokumentasi formal'),
-- 26. EDM Party Night (Music Festival)
(26, '21:00', '22:30', 'Opening: Deep House Set', 'Warming up the dance floor by Resident DJ'),
(26, '22:30', '23:30', 'Visual & Laser Show Intro', 'Transisi ke musik yang lebih upbeat (Tech House)'),
(26, '23:30', '01:30', 'Main Stage Performance (Headliner)', 'The big festival EDM sound & pyrotechnics'),
(26, '01:30', '03:00', 'After Hours Melodic Set', 'Closing set untuk menjaga mood penonton'),
-- 27. Book Fair 2025 (Exhibition)
(27, '09:00', '11:00', 'Author Meet & Greet (Main Stage)', 'Diskusi buku baru dan sesi tanda tangan'),
(27, '11:00', '13:00', 'Writing Workshop for Kids', 'Melatih imajinasi anak melalui cerita pendek'),
(27, '13:00', '15:00', 'Publisher Presentation', 'Informasi cara mengirim naskah ke penerbit'),
(27, '15:00', '21:00', 'Flash Sale Hour', 'Diskon tambahan 50% di jam-jam tertentu'),
-- 28. Street Fighter Tournament (Gaming)
(28, '11:00', '13:00', 'Pool A: Round Robin', 'Penyisihan grup A di area gaming station'),
(28, '13:00', '15:00', 'Pool B: Round Robin', 'Penyisihan grup B di area gaming station'),
(28, '15:00', '16:00', 'Quarter-Finals (Off-Stream)', 'Pertandingan penentuan Top 4'),
(28, '16:00', '18:00', 'Top 4 Final: Live Main Stage', 'Semi-final dan Grand Final dengan caster profesional'),
-- 29. Pastry Baking
(29, '08:00', '08:30', 'Mise en Place', 'Persiapan bahan dan peralatan masing-masing'),
(29, '08:30', '09:30', 'Dough Making Process', 'Teknik laminasi adonan croissant'),
(29, '09:30', '10:30', 'Fermentation & Rest', 'Proses proofing adonan'),
(29, '10:30', '11:30', 'Shaping & Baking', 'Membentuk adonan dan proses oven'),
(29, '11:30', '12:00', 'Glazing & Decoration', 'Finishing agar pastry terlihat mengkilap'),
-- 30. Cyber Security Awareness
(30, '09:30', '10:00', 'Registration & Security Pre-Quiz', 'Peserta mengisi kuis singkat untuk mengukur pemahaman awal tentang keamanan siber.'),
(30, '10:00', '10:30', 'Introduction: The Global Threat Landscape', 'Gambaran umum mengenai tren serangan siber di Indonesia tahun 2025.'),
(30, '10:30', '11:00', 'Live Demo: Social Engineering Attacks', 'Simulasi serangan phishing melalui WhatsApp dan email palsu secara real-time.'),
(30, '11:00', '11:30', 'Personal Data Privacy Audit', 'Peserta mengecek kebocoran data (Data Breach) masing-masing menggunakan tool khusus.'),
(30, '11:30', '12:00', 'Workshop: Hardening Your Digital Life', 'Praktek langsung setting 2FA (Two-Factor Authentication) dan penggunaan Password Manager.'),
(30, '12:00', '12:30', 'Q&A: Ask the Expert', 'Sesi tanya jawab terbuka mengenai keamanan perangkat IoT dan mobile banking.'),
(30, '12:30', '13:00', 'Post-Quiz & Digital Certificate', 'Kuis akhir dan pembagian sertifikat digital sebagai tanda kelulusan awareness.');

-- ======================
-- 6. events_guests
-- ======================


-- ======================
-- 7. appusers_apppermissions
-- ======================
INSERT INTO `appusers_apppermissions` (`perm_name`, `slug`, `description`) VALUES
-- Modul System (Hanya Super Admin)
('System settings', 'system_settings', 'Mengubah konfigurasi inti aplikasi dan API keys'),
('View logs', 'view_logs', 'Melihat log aktivitas seluruh admin'),
-- Modul Admin Management
('Manage admins', 'manage_admins', 'Menambah, edit, dan menghapus akun app_admins'),
('Manage roles', 'manage_roles', 'Mengatur hak akses dan role'),
-- Modul Event Operasional
('View events', 'view_events', 'Melihat daftar seluruh event'),
('Create events', 'create_events', 'Menambah event baru dari sisi internal'),
('Edit events', 'edit_events', 'Mengubah data event'),
('Delete events', 'delete_events', 'Menghapus data event'),
('Validate events', 'validate_events', 'Menyetujui atau menolak pengajuan event dari EO'),
-- Modul EO & User
('Manage eo', 'manage_eo', 'Verifikasi dan kelola data Event Organizer'),
('View users', 'view_users', 'Melihat data PIC/User EO'),
-- Modul Finance & Support
('View finance', 'view_finance', 'Melihat laporan keuangan dan transaksi tiket'),
('Manage payouts', 'manage_payouts', 'Menyetujui pencairan dana ke EO'),
('View support', 'view_support', 'Melihat dan membalas tiket bantuan/support');


-- ======================
-- 8. appusers_role_permission
-- ======================
INSERT INTO `appusers_role_permission` (`role_name`, `perm_name`) VALUES 
-- 1. ROLE: SUPER ADMIN (Semua Fitur)
('Super Admin', 'System settings'),
('Super Admin', 'View logs'),
('Super Admin', 'Manage admins'),
('Super Admin', 'Manage roles'),
('Super Admin', 'View events'),
('Super Admin', 'Create events'),
('Super Admin', 'Edit events'),
('Super Admin', 'Delete events'),
('Super Admin', 'Validate events'),
('Super Admin', 'Manage eo'),
('Super Admin', 'View users'),
('Super Admin', 'View finance'),
('Super Admin', 'Manage payouts'),
('Super Admin', 'View support'),
-- 2. ROLE: ADMIN
('Admin', 'Manage admins'),
('Admin', 'Manage roles'),
('Admin', 'View events'),
('Admin', 'Create events'),
('Admin', 'Edit events'),
('Admin', 'Delete events'),
('Admin', 'Validate events'),
('Admin', 'Manage eo'),
('Admin', 'View users'),
('Admin', 'View finance'),
('Admin', 'Manage payouts'),
('Admin', 'View support'),
-- 3. ROLE: LEADER
('Leader', 'View events'),
('Leader', 'Create events'),
('Leader', 'Edit events'),
('Leader', 'Delete events'),
('Leader', 'Validate events'),
('Leader', 'Manage eo'),
('Leader', 'View users'),
('Leader', 'View finance'),
('Leader', 'Manage payouts'),
('Leader', 'View support'),
-- 4. ROLE: VALIDATOR
('Validator', 'View events'),
('Validator', 'Edit events'),
('Validator', 'Validate events'),
('Validator', 'Manage eo'),
('Validator', 'View users'),
-- 5. ROLE: FINANCE
('Finance', 'View events'),
('Finance', 'View finance'),
('Finance', 'Manage payouts'),
-- 6. ROLE: SUPPORT
('Support', 'View events'),
('Support', 'View users'),
('Support', 'View support');


-- ======================
-- 9. appusers_role
-- ======================
-- appusers_role
-- super_admin,"Akses penuh: Manajemen User Admin, Konfigurasi Sistem, Backup Data, dan semua fitur operasional."
-- admin,"Akses fitur operasional & laporan, tapi tidak bisa membuka menu System Settings (API Keys, Mail Server, dll)."
-- leader,"Akses ke semua fitur kecuali System Settings dan menu Manajemen App Admins (tidak bisa tambah/edit admin lain)."
-- validator,"Hanya bisa mengakses menu verifikasi EO, persetujuan event, dan daftar event (Fitur Operasional)."
-- ======================

INSERT INTO `appusers_role` (`role_name`, `role_slug`, `description`) VALUES
('Super Admin', 'super_admin', 'Akses penuh seluruh sistem dan pengaturan utama'),
('Admin', 'admin', 'Akses fitur penuh kecuali pengaturan utama sistem'),
('Leader', 'leader', 'Akses fitur operasional dan laporan, tidak bisa kelola user admin'),
('Validator', 'validator', 'Hanya akses fitur operasional/verifikasi data'),
('Finance', 'finance', 'Hanya akses modul keuangan dan transaksi'),
('Support', 'support', 'Akses bantuan pengguna dan tiket');

-- ======================
-- 10. appusers
-- ======================
-- app_admins
-- rememberme_token, "agar tidak perlu login lagi"
-- ======================
INSERT INTO `appusers` (`username`, `full_name`, `email`, `password`, `role`, `status`) VALUES
-- 4 User Utama Permintaan
('superadmin', 'Super Admin Utama', 'admin.utama@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'super_admin', 'Active'),
('sarip', 'Sarip Hidayat', 'sarip@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Active'),
('zalfa', 'Zalfa Kamila', 'zalfa@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'validator', 'Active'),
('yoga', 'Yoga Pratama', 'yoga@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'leader', 'Active'),
('nadin', 'Nadin Amizah', 'nadin.finance@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'finance', 'Active'),
('farras', 'Farras Muhammad', 'farras.ops@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'validator', 'Active'),
('dimas', 'Dimas Anggara', 'dimas.support@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'support', 'Active'),
('putri', 'Putri Rahayu', 'putri.admin@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 'Active'),
('rudi', 'Rudi Tabuti', 'rudi.support@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'support', 'Inactive'), -- User Non-aktif
('maya', 'Maya Sari', 'maya.finance@veentix.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'finance', 'Active');

-- ======================
-- 11. users
-- ======================
DELETE FROM users;
INSERT INTO users (eo_id, username, name, email, password, phone, role, refferalcode, status) VALUES
-- 1. DATA EO ADMIN & STAFF
(1, 'andipratama', 'Andi Pratama', 'andi.admin@indoesport.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081200000001', 'EO Admin', 'ANDI-IND01', 'Active'),
(1, 'budistaff', 'Budi Staff', 'budi.staff@indoesport.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081200000002', 'EO Staff', 'BUDI-IND02', 'Active'),
(2, 'citralestari', 'Citra Lestari', 'citra.admin@creativemedia.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081300000001', 'EO Admin', 'CITRA-CRM01', 'Active'),
(2, 'dedistaff', 'Dedi Staff', 'dedi.staff@creativemedia.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081300000002', 'EO Staff', 'DEDI-CRM02', 'Active'),
(3, 'ekawijaya', 'Eka Wijaya', 'eka.admin@techtalks.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081400000001', 'EO Admin', 'EKA-TECH01', 'Active'),
(3, 'feristaff', 'Feri Staff', 'feri.staff@techtalks.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081400000002', 'EO Staff', 'FERI-TECH02', 'Inactive'),
(4, 'gilangramadhan', 'Gilang Ramadhan', 'gilang.admin@melodypro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081500000001', 'EO Admin', 'GILANG-MLD01', 'Active'),
(4, 'hanistaff', 'Hani Staff', 'hani.staff@melodypro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081500000002', 'EO Staff', 'HANI-MLD02', 'Active'),
(5, 'indrakusuma', 'Indra Kusuma', 'indra.admin@globalexpo.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081600000001', 'EO Admin', 'INDRA-GLB01', 'Active'),
(5, 'jokostaff', 'Joko Staff', 'joko.staff@globalexpo.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081600000002', 'EO Staff', 'JOKO-GLB02', 'Suspend'),

-- 2. DATA VENDOR
(NULL, 'vendor_catering', 'Vendor Catering Sejahtera', 'kontak@cateringsejahtera.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081900001001', 'Vendor', 'VND-CATR', 'Active'),
(NULL, 'vendor_sound', 'Vendor Sound System Pro', 'info@soundsystempro.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081900001002', 'Vendor', 'VND-SND', 'Active'),
(NULL, 'vendor_decor', 'Vendor Stage Decor', 'hello@stagedecor.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081900001003', 'Vendor', 'VND-DECO', 'Inactive'),
(NULL, 'vendor_security', 'Vendor Security Force', 'ops@securityforce.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081900001004', 'Vendor', 'VND-SEC', 'Active'),
(NULL, 'vendor_led', 'Vendor LED Multimedia', 'sales@ledmulti.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081900001005', 'Vendor', 'VND-LED', 'Active'),

-- 3. DATA VIP MEMBER
(NULL, 'rbudihartono', 'Robert Budi Hartono', 'rb.hartono@djarum.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002001', 'VIP Member', 'VIP-BUDIH', 'Active'),
(NULL, 'ctanjung', 'Chairul Tanjung', 'ct@ctcorp.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002002', 'VIP Member', 'VIP-CTANJUNG', 'Active'),
(NULL, 'asalim', 'Anthoni Salim', 'salim.group@indofood.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002003', 'VIP Member', 'VIP-ASALIM', 'Active'),
(NULL, 'srimulyani', 'Sri Mulyani', 'srimul.sm@kemenkeu.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002004', 'VIP Member', 'VIP-SRIMUL', 'Active'),
(NULL, 'gracenatalie', 'Grace Natalie', 'grace.n@psi.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002005', 'VIP Member', 'VIP-GRACE', 'Active'),
(NULL, 'iwanfals', 'Iwan Fals', 'oi.fals@iwanfals.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002006', 'VIP Member', 'VIP-FALS', 'Active'),
(NULL, 'titiekpuspa', 'Titiek Puspa', 'eyang.titiek@maestro.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002007', 'VIP Member', 'VIP-TPUSPA', 'Active'),
(NULL, 'addiems', 'Addie MS', 'addiems@twilite.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002008', 'VIP Member', 'VIP-ADDIE', 'Active'),
(NULL, 'yoviewidianto', 'Yovie Widianto', 'yovie.w@kreatif.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002009', 'VIP Member', 'VIP-YOVIE', 'Active'),
(NULL, 'anggun', 'Anggun C Sasmi', 'anggun.world@paris.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002010', 'VIP Member', 'VIP-ANGGUN', 'Active'),
(NULL, 'cintalaura', 'Cinta Laura', 'cinta.kiehl@foundation.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002011', 'VIP Member', 'VIP-CINTA', 'Active'),
(NULL, 'merryriana', 'Merry Riana', 'merry@motivation.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002012', 'VIP Member', 'VIP-MERRY', 'Active'),
(NULL, 'tungdesem', 'Tung Desem Waringin', 'tdw@marketing.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002013', 'VIP Member', 'VIP-TDW', 'Active'),
(NULL, 'kakseto', 'Seto Mulyadi', 'kakseto@anak.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002014', 'VIP Member', 'VIP-KSETO', 'Active'),
(NULL, 'butetk', 'Butet Kartaredjasa', 'butet@seni.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081100002015', 'VIP Member', 'VIP-BUTET', 'Active'),

-- 4. DATA GENERAL USERS
(NULL, 'rezarahadian', 'Reza Rahadian', 'reza.rahadian@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110001', 'General_User', 'REZA-REF', 'Active'),
(NULL, 'diansastro', 'Dian Sastrowardoyo', 'dian.sastro@yahoo.co.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110002', 'General_User', 'DIAN-REF', 'Active'),
(NULL, 'nicsap', 'Nicholas Saputra', 'nicsap@icloud.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110003', 'General_User', 'NICSAP-REF', 'Active'),
(NULL, 'chelseaislan', 'Chelsea Islan', 'chelsea.islan@outlook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110004', 'General_User', 'CHELSEA-REF', 'Active'),
(NULL, 'joetaslim', 'Joe Taslim', 'joe.taslim@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110005', 'General_User', 'JOE-REF', 'Active'),
(NULL, 'pevitapearce', 'Pevita Pearce', 'pevita.p@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110006', 'General_User', 'PEV-REF', 'Active'),
(NULL, 'ikouwais', 'Iko Uwais', 'iko.uwais@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110007', 'General_User', 'IKO-REF', 'Active'),
(NULL, 'adiniaw', 'Adinia Wirasti', 'adinia.w@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110008', 'General_User', 'ADINIA-REF', 'Active'),
(NULL, 'chicojericho', 'Chico Jericho', 'chico.j@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110009', 'General_User', 'CHICO-REF', 'Active'),
(NULL, 'tarabasro', 'Tara Basro', 'tara.basro@icloud.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081211110010', 'General_User', 'TARA-REF', 'Active'),
(NULL, 'ahmadzaky', 'Ahmad Zaky', 'zaky.bukalapak@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220011', 'General_User', 'ZAKY-REF', 'Active'),
(NULL, 'nadiem', 'Nadiem Makarim', 'nadiem.m@outlook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220012', 'General_User', 'NADIEM-REF', 'Active'),
(NULL, 'willtanu', 'William Tanuwijaya', 'william.t@tokopedia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220013', 'General_User', 'WILL-REF', 'Active'),
(NULL, 'ferryunardi', 'Ferry Unardi', 'ferry.u@traveloka.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220014', 'General_User', 'FERRY-REF', 'Active'),
(NULL, 'alkatiri', 'Achmad Alkatiri', 'alkatiri.a@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220015', 'General_User', 'ACHMAD-REF', 'Active'),
(NULL, 'shinta_d', 'Shinta Dhanuwardoyo', 'shinta.d@bubu.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220016', 'General_User', 'SHINTA-REF', 'Active'),
(NULL, 'alamanda', 'Alamanda Shantika', 'alamanda.s@binar.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220017', 'General_User', 'ALA-REF', 'Active'),
(NULL, 'budihandoko', 'Budi Handoko', 'budi.h@shipper.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220018', 'General_User', 'BUDIH-REF', 'Active'),
(NULL, 'mellyyana', 'Mellyyana', 'melly@techinasia.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220019', 'General_User', 'MELLY-REF', 'Active'),
(NULL, 'ramamamuaya', 'Rama Mamuaya', 'rama@dailysocial.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081322220020', 'General_User', 'RAMA-REF', 'Suspend'),
(NULL, 'bepe20', 'Bambang Pamungkas', 'bepe20@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330021', 'General_User', 'BEPE-REF', 'Active'),
(NULL, 'susisusanti', 'Susi Susanti', 'susi.s@olympic.org', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330022', 'General_User', 'SUSI-REF', 'Active'),
(NULL, 'taufikh', 'Taufik Hidayat', 'taufik.h@badminton.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330023', 'General_User', 'TAUIK-REF', 'Active'),
(NULL, 'ekoyuli', 'Eko Yuli', 'eko.yuli@angkatbesi.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330024', 'General_User', 'EKO-REF', 'Active'),
(NULL, 'greyspolii', 'Greysia Polii', 'greys.polii@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330025', 'General_User', 'GREYS-REF', 'Active'),
(NULL, 'apriyani', 'Apriyani Rahayu', 'apri.rahayu@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330026', 'General_User', 'APRI-REF', 'Active'),
(NULL, 'ginting', 'Anthony Ginting', 'sinisukan.ginting@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330027', 'General_User', 'GINTING-REF', 'Active'),
(NULL, 'jojo', 'Jonatan Christie', 'jojo.christie@icloud.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330028', 'General_User', 'JOJO-REF', 'Active'),
(NULL, 'kevins', 'Kevin Sanjaya', 'kevin.s@minions.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330029', 'General_User', 'KEVIN-REF', 'Active'),
(NULL, 'marcusg', 'Marcus Gideon', 'marcus.g@minions.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081533330030', 'General_User', 'MARCUS-REF', 'Active'),
(NULL, 'sitiaminah', 'Siti Aminah', 'siti.aminah@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440031', 'General_User', 'SITI-REF', 'Inactive'),
(NULL, 'jokowi', 'Joko Widodo', 'jokowi.fan@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440032', 'General_User', 'JKW-REF', 'Active'),
(NULL, 'prabowo', 'Prabowo Subianto', 'prabowo.s@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440033', 'General_User', 'PS-REF', 'Active'),
(NULL, 'ganjarp', 'Ganjar Pranowo', 'ganjar.p@outlook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440034', 'General_User', 'GANJAR-REF', 'Active'),
(NULL, 'aniesbas', 'Anies Baswedan', 'anies.b@icloud.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440035', 'General_User', 'ANIES-REF', 'Active'),
(NULL, 'ridwank', 'Ridwan Kamil', 'kang.emil@bandung.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440036', 'General_User', 'RK-REF', 'Active'),
(NULL, 'khofifah', 'Khofifah Indar', 'khofifah.ip@jatim.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440037', 'General_User', 'KHOF-REF', 'Active'),
(NULL, 'sandiuno', 'Sandiaga Uno', 'sandi.uno@kemenparekraf.go.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440038', 'General_User', 'SANDI-REF', 'Active'),
(NULL, 'erickt', 'Erick Thohir', 'erick.t@bumn.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440039', 'General_User', 'ERICK-REF', 'Active'),
(NULL, 'agusyudhoyono', 'Agus Harimurti', 'ahy.yudhoyono@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081744440040', 'General_User', 'AHY-REF', 'Active'),
(NULL, 'bsetiawan', 'Budi Setiawan', 'budi.binomo@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550041', 'General_User', 'BSET-REF', 'Suspend'),
(NULL, 'anisulastri', 'Ani Sulastri', 'ani.sulastri@yahoo.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550042', 'General_User', 'ANI-REF', 'Active'),
(NULL, 'wawanher', 'Wawan Hermawan', 'wawan.h@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550043', 'General_User', 'WAWAN-REF', 'Active'),
(NULL, 'tutialawiyah', 'Tuti Alawiyah', 'tuti.a@outlook.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550044', 'General_User', 'TUTI-REF', 'Active'),
(NULL, 'dedimulyadi', 'Dedi Mulyadi', 'dedi.m@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550045', 'General_User', 'DMUL-REF', 'Active'),
(NULL, 'siskakohl', 'Siska Kohl', 'siska.kohl@money.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550046', 'General_User', 'SISKA-REF', 'Active'),
(NULL, 'jessnolimit', 'Jess No Limit', 'jess.limit@mlbb.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550047', 'General_User', 'JESS-REF', 'Active'),
(NULL, 'radityadika', 'Raditya Dika', 'radit.dika@lucu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550048', 'General_User', 'RADIT-REF', 'Active'),
(NULL, 'deddycorbuzier', 'Deddy Corbuzier', 'deddy.c@podcast.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550049', 'General_User', 'DC-REF', 'Active'),
(NULL, 'najwashihab', 'Najwa Shihab', 'najwa.shihab@matanajwa.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081955550050', 'General_User', 'NANA-REF', 'Active'),
(NULL, 'raffiahmad', 'Raffi Ahmad', 'raffi.a@rans.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660051', 'General_User', 'RAFFI-REF', 'Active'),
(NULL, 'nagitas', 'Nagita Slavina', 'nagita.s@rans.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660052', 'General_User', 'GIGI-REF', 'Active'),
(NULL, 'attahalilintar', 'Atta Halilintar', 'atta.h@ahha.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660053', 'General_User', 'ATTA-REF', 'Active'),
(NULL, 'aurelh', 'Aurel Hermansyah', 'aurel.h@ahha.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660054', 'General_User', 'AUREL-REF', 'Active'),
(NULL, 'baimwong', 'Baim Wong', 'baim.wong@tigerwong.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660055', 'General_User', 'BAIM-REF', 'Active'),
(NULL, 'paulaver', 'Paula Verhoeven', 'paula.v@tigerwong.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660056', 'General_User', 'PAULA-REF', 'Active'),
(NULL, 'andretaulany', 'Andre Taulany', 'andre.t@prediksi.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660057', 'General_User', 'ANDRE-REF', 'Active'),
(NULL, 'suleprikitiw', 'Sule Prikitiw', 'sule.p@prikitiw.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660058', 'General_User', 'SULE-REF', 'Inactive'),
(NULL, 'vincentrompies', 'Vincent Rompies', 'vincent.r@vindes.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660059', 'General_User', 'VINCENT-REF', 'Active'),
(NULL, 'destamahendra', 'Desta Mahendra', 'desta.m@vindes.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081266660060', 'General_User', 'DESTA-REF', 'Active'),
(NULL, 'gadingmarten', 'Gading Marten', 'gading.m@kuy.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770061', 'General_User', 'GADING-REF', 'Active'),
(NULL, 'lunamaya', 'Luna Maya', 'luna.m@nama.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770062', 'General_User', 'LUNA-REF', 'Active'),
(NULL, 'syahrini', 'Syahrini', 'princess.s@cetarr.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770063', 'General_User', 'SYR-REF', 'Active'),
(NULL, 'ivangunawan', 'Ivan Gunawan', 'ivan.g@fashion.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770064', 'General_User', 'IVAN-REF', 'Active'),
(NULL, 'agnezmo', 'Agnez Mo', 'agnez.m@hollywood.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770065', 'General_User', 'AGNEZ-REF', 'Active'),
(NULL, 'richbrian', 'Rich Brian', 'rich.b@88rising.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770066', 'General_User', 'BRIAN-REF', 'Active'),
(NULL, 'nikizefanya', 'NIKI Zefanya', 'niki.z@88rising.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770067', 'General_User', 'NIKI-REF', 'Active'),
(NULL, 'stephaniep', 'Stephanie Poetri', 'stephanie.p@88rising.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770068', 'General_User', 'STEP-REF', 'Active'),
(NULL, 'isyanas', 'Isyana Sarasvati', 'isyana.s@lexicon.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770069', 'General_User', 'ISYANA-REF', 'Active'),
(NULL, 'raisaandriana', 'Raisa Andriana', 'raisa.a@yourraisa.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081377770070', 'General_User', 'RAISA-REF', 'Active'),
(NULL, 'tulus', 'Tulus', 'tulus.m@gajah.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880071', 'General_User', 'TULUS-REF', 'Active'),
(NULL, 'kuntoaji', 'Kunto Aji', 'kunto.aji@mantramantra.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880072', 'General_User', 'KAJI-REF', 'Active'),
(NULL, 'fiersabesari', 'Fiersa Besari', 'fiersa.b@gariswaktu.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880073', 'General_User', 'FIERSA-REF', 'Active'),
(NULL, 'baskaraputra', 'Baskara Putra', 'baskara.p@feast.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880074', 'General_User', 'HINDIA-REF', 'Active'),
(NULL, 'pamungkas', 'Pamungkas', 'pam@walkthegradually.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880075', 'General_User', 'PAM-REF', 'Active'),
(NULL, 'ardhitop', 'Ardhito Pramono', 'ardhito.p@jazz.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880076', 'General_User', 'AR-REF', 'Active'),
(NULL, 'marionjola', 'Marion Jola', 'marion.j@lala.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880077', 'General_User', 'MARION-REF', 'Active'),
(NULL, 'tiaraandini', 'Tiara Andini', 'tiara.a@superstar.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880078', 'General_User', 'TIARA-REF', 'Active'),
(NULL, 'lyodrag', 'Lyodra Ginting', 'lyodra.g@superstar.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880079', 'General_User', 'LYODRA-REF', 'Active'),
(NULL, 'zivamagnolya', 'Ziva Magnolya', 'ziva.m@superstar.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/', '081388880080', 'General_User', 'ZIVA-REF', 'Active');

-- ======================
-- 12. sys_users_role
-- ======================
INSERT INTO `sys_users_role` (`role_name`, `role_slug`, `description`) VALUES
-- Level Penyelenggara (Organizer)
('EO Admin', 'eo_admin', 'Pemilik akun EO: Memiliki kontrol penuh atas semua event yang dibuat oleh organisasinya.'),
('EO Staff', 'eo_staff', 'Staf Operasional: Dapat mengelola event dan melakukan check-in peserta, namun tidak bisa melihat laporan keuangan.'),
('EO Finance', 'eo_finance', 'Staf Keuangan EO: Fokus pada laporan penjualan tiket dan pengajuan pencairan dana (payout).'),
-- Level Pengguna Umum (Participant/User)
('General User', 'general_user', 'Pengguna umum: Dapat mencari event, membeli tiket, dan mengelola profil pribadi.'),
('VIP Member', 'vip_member', 'Pengguna Prioritas: Mendapatkan akses awal (early access) ke tiket event tertentu atau diskon khusus.'),
-- Level Pengguna Umum (Participant/User)
('Bronze Member', 'bronze_member', 'Pengguna Prioritas: Mendapatkan akses awal (early access) ke tiket event tertentu atau diskon khusus.'),
('Silver Member', 'silver_member', 'Pengguna Prioritas: Mendapatkan akses awal (early access) ke tiket event tertentu atau diskon khusus.'),
('Gold Member', 'gold_member', 'Pengguna Prioritas: Mendapatkan akses awal (early access) ke tiket event tertentu atau diskon khusus.'),
('Platinum Member', 'platinum_member', 'Pengguna Prioritas: Mendapatkan akses awal (early access) ke tiket event tertentu atau diskon khusus.'),
('Black Card', 'black_card', 'Pengguna Prioritas: Mendapatkan akses awal (early access) ke tiket event tertentu atau diskon khusus.'),

-- Level Vendor/Partner
('Vendor', 'vendor', 'Pihak ketiga: Dapat melihat detail kebutuhan event (seperti konsumsi/logistik) jika diberikan akses oleh EO.');

-- baru sampai sini
-- ======================
-- 13. sys_users_role_permission
-- ======================
DELETE FROM sys_users_role_permission;
INSERT INTO `sys_users_role_permission` (`role_name`, `perm_name`) VALUES 
-- 1. ROLE: SUPER ADMIN (Semua Fitur)
('Super Admin', 'System settings'),
('Super Admin', 'View logs'),
('Super Admin', 'Manage admins'),
('Super Admin', 'Manage roles'),
('Super Admin', 'View events'),
('Super Admin', 'Create events'),
('Super Admin', 'Edit events'),
('Super Admin', 'Delete events'),
('Super Admin', 'Validate events'),
('Super Admin', 'Manage eo'),
('Super Admin', 'View users'),
('Super Admin', 'View finance'),
('Super Admin', 'Manage payouts'),
('Super Admin', 'View support'),
-- 2. ROLE: ADMIN
('Admin', 'Manage admins'),
('Admin', 'Manage roles'),
('Admin', 'View events'),
('Admin', 'Create events'),
('Admin', 'Edit events'),
('Admin', 'Delete events'),
('Admin', 'Validate events'),
('Admin', 'Manage eo'),
('Admin', 'View users'),
('Admin', 'View finance'),
('Admin', 'Manage payouts'),
('Admin', 'View support'),
-- 3. ROLE: LEADER
('Leader', 'View events'),
('Leader', 'Create events'),
('Leader', 'Edit events'),
('Leader', 'Delete events'),
('Leader', 'Validate events'),
('Leader', 'Manage eo'),
('Leader', 'View users'),
('Leader', 'View finance'),
('Leader', 'Manage payouts'),
('Leader', 'View support'),
-- 4. ROLE: VALIDATOR
('Validator', 'View events'),
('Validator', 'Edit events'),
('Validator', 'Validate events'),
('Validator', 'Manage eo'),
('Validator', 'View users'),
-- 5. ROLE: FINANCE
('Finance', 'View events'),
('Finance', 'View finance'),
('Finance', 'Manage payouts'),
-- 6. ROLE: SUPPORT
('Support', 'View events'),
('Support', 'View users'),
('Support', 'View support');

-- ======================
-- 14. userpoint_rules
-- ======================
DELETE FROM userpoint_rules;
INSERT INTO userpoint_rules (activity_name, description, points, is_active, min_transaction_amount, max_times_per_day, cooldown_minutes, start_date, end_date, point_expiry_days) VALUES
('PURCHASE_BASIC', 'Poin standar setiap pembelanjaan minimal Rp 50.000', 10, TRUE, 50000.00, NULL, 0, '2026-01-01 00:00:00', NULL,≠≠≠≠
('PURCHASE_VIP', 'Poin tambahan untuk transaksi besar di atas Rp 1.000.000', 100, TRUE, 1000000.00, NULL, 0, '2026-01-01 00:00:00', NULL, 365),
('PURCHASE_MEGA', 'Bonus poin loyalitas untuk transaksi di atas Rp 5.000.000', 500, TRUE, 50000.00, 1, 0, '2026-01-01 00:00:00', NULL, 730),
('FACILITY_BOOKING', 'Poin yang didapat setelah berhasil menyewa fasilitas', 25, TRUE, 0.00, 2, 60, '2026-01-01 00:00:00', NULL, 180),
('USER_REGISTRATION', 'Poin selamat datang untuk user baru', 100, TRUE, 0.00, 1, 0, '2026-01-01 00:00:00', NULL, NULL),
('DAILY_LOGIN', 'Poin harian untuk login ke platform', 5, TRUE, 0.00, 1, 1440, '2026-01-01 00:00:00', NULL, 30),
('REFERRAL_SUCCESS', 'Poin jika referral code digunakan oleh orang lain', 150, TRUE, 0.00, 5, 0, '2026-01-01 00:00:00', NULL, 365),
('NEW_YEAR_SURPRISE', 'Bonus poin khusus selama periode awal tahun 2026', 200, TRUE, 100000.00, 1, 0, '2026-01-01 00:00:00', '2026-01-31 23:59:59', 90);
('User_Registration', 'Poin bonus saat pendaftaran pengguna baru', 100, TRUE, 0.00, 1, 0, NULL, NULL, 365),
('Daily_Login', 'Poin login harian', 5, TRUE, 0.00, 1, 1440, NULL, NULL, 30),
('Facility_Booking_Basic', 'Poin standar setiap melakukan penyewaan fasilitas', 50, TRUE, 50000.00, 3, 0, NULL, NULL, 180),
('Facility_Booking_HighValue', 'Bonus poin untuk transaksi sewa di atas 1 Juta Rupiah', 250, TRUE, 1000000.00, NULL, 0, NULL, NULL, 180),
('Facility_Booking_BigHall', 'Bonus poin khusus sewa aula besar (min 5 Juta)', 1000, TRUE, 5000000.00, 1, 0, NULL, NULL, 365),
('New_Year_2026_Booking', 'Promo poin double selama periode Tahun Baru 2026', 500, TRUE, 100000.00, 2, 0, '2026-01-01 00:00:00', '2026-01-07 23:59:59', 90);

/*
('Daily_Checkin','Activity description', 10, 1, 0, 1, 1440, NULL, NULL, 30),
('Weekly_Login_Streak','Activity description',  50, 1, 0, 1, 10080, NULL, NULL, 90),
('Event_Attendance_Physical','Activity description',  100, 1, 0, 2, 0, NULL, NULL, 365),
('Event_Attendance_Virtual','Activity description',  50, 1, 0, 3, 0, NULL, NULL, 180),
('Early_Bird_Arrival','Activity description',  25, 1, 0, 1, 0, NULL, NULL, 90),
('Ticket_Purchase_Standard','Activity description',  500, 1, 50000.00, NULL, 0, NULL, NULL, 730),
('Ticket_Purchase_VIP','Activity description',  2000, 1, 500000.00, NULL, 0, NULL, NULL, 730),
('Merchandise_Purchase','Activity description',  200, 1, 100000.00, NULL, 0, NULL, NULL, 365),
('Food_And_Beverage_Buy','Activity description',  75, 1, 25000.00, 5, 0, NULL, NULL, 180),
('New_User_Referral','Activity description',  1000, 1, 0, 10, 0, NULL, NULL, NULL),
('Referral_First_Transaction','Activity description',  1500, 1, 100000.00, NULL, 0, NULL, NULL, NULL),
('Submit_Event_Review','Activity description',  150, 1, 0, 1, 0, NULL, NULL, 180),
('Share_Event_To_Social_Media','Activity description',  30, 1, 0, 5, 60, NULL, NULL, 30),
('Upload_Photo_At_Venue','Activity description',  40, 1, 0, 3, 10, NULL, NULL, 60),
('Fill_Post_Event_Survey','Activity description',  200, 1, 0, 1, 0, NULL, NULL, 365),
('New_Year_2026_Celebration','Activity description',  250, 1, 0, 1, 0, '2026-01-01 00:00:00', '2026-01-03 23:59:59', 60),
('Imlek_2026_Bonus','Activity description',  188, 1, 88000.00, 1, 0, '2026-02-17 00:00:00', '2026-02-19 23:59:59', 90),
('Ramadan_Kareem_2026','Activity description',  150, 1, 0, 1, 1440, '2026-02-18 00:00:00', '2026-03-20 23:59:59', 30),
('Lebaran_Sale_2026','Activity description',  1000, 1, 250000.00, NULL, 0, '2026-03-15 00:00:00', '2026-03-25 23:59:59', 180),
('Mid_Year_Festival_2026','Activity description',  300, 1, 150000.00, 2, 0, '2026-06-01 00:00:00', '2026-06-30 23:59:59', 120),
('Independence_Day_79_RI','Activity description',  178, 1, 0, 1, 0, '2026-08-17 00:00:00', '2026-08-17 23:59:59', 45),
('Summer_Holiday_Special','Activity description',  200, 1, 100000.00, NULL, 0, '2026-07-01 00:00:00', '2026-07-31 23:59:59', 90),
('World_Music_Day_2026','Activity description',  50, 1, 0, 1, 0, '2026-06-21 00:00:00', '2026-06-21 23:59:59', 30),
('Harbolnas_1212_2026','Activity description',  1212, 1, 121000.00, 1, 0, '2026-12-12 00:00:00', '2026-12-12 23:59:59', 365),
('Christmas_2026_Gift','Activity description',  500, 1, 200000.00, 1, 0, '2026-12-24 00:00:00', '2026-12-26 23:59:59', 180);
('Complete_User_Profile','Activity description',  300, 1, 0, 1, 0, NULL, NULL, NULL),
('Verify_ID_Card','Activity description',  1000, 1, 0, 1, 0, NULL, NULL, NULL),
('Link_Social_Media_Account','Activity description',  150, 1, 0, 3, 0, NULL, NULL, 365);
*/
-- ======================
-- 15. sys_userpoint_cat
-- ======================
DELETE FROM sys_userpoint_cat;
INSERT INTO sys_userpoint_cat (name, description) VALUES
('Transactional', 'Pembelian tiket, booking merchandise'),
('Engagement', 'Login harian, lengkapi profil, review'),
('Attendance', 'Scan QR masuk, ikut sesi'),
('Referral', 'Ajak teman'),
('Adjustment', 'Perbaikan point manual oleh admin(khusus)');

/*'Registration',      -- Daftar akun baru
        'Event_Attendance',  -- Hadir di lokasi (Scan QR)
        'Event_Review',      -- Memberikan ulasan event
        'Ticket_Purchase',   -- Membeli tiket
        'Referral',          -- Mengajak teman
        'Redeem_Reward'      -- Poin ditukarkan (Minus)
*/
-- ======================
-- 16. userpoint_status
-- ======================
INSERT INTO userpoint_status (name, description) VALUES
('Pending', 'User membeli tiket, tapi status pembayaran masih diverifikasi atau acara belum berlangsung. -- Default saat data masuk.'),
('Active', 'Pembayaran sukses atau user sudah melakukan Scan QR kehadiran di lokasi. -- Diupdate manual oleh sistem/admin setelah syarat terpenuhi.'),
('Inactive', 'Poin yang sengaja dinonaktifkan oleh admin karena adanya sengketa atau pengecekan data. -- Diupdate manual oleh Admin.'),
('Expired', 'Poin sudah melewati expiry_date. -- Dicek secara berkala oleh sistem (Cron Job).'),
('Cancelled', 'User membatalkan pesanan (Refund), maka poin yang didapat otomatis dibatalkan. -- Saat proses Refund sukses.'),
('Redeem', 'User dapat menggungakan poin untuk membeli tiket. -- Saat proses saat pembelian.');

-- ======================
-- 17. userpoint_logs
-- ======================

DELETE FROM `userpoint_logs`; 
INSERT INTO `userpoint_logs` 
(`user_id`, `source_id`, `source_type`, `point_cat`, `activity_type`, `amount`, `point_status`, `description`, `expiry_date`, `activated_at`) 
VALUES
-- Tabel Orders
(16, 1, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-001', '2027-01-01', NOW()),
(16, 1, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-001', '2026-04-01', NOW()),
(17, 2, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-002', '2027-01-01', NOW()),
(17, 2, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-002', '2026-04-01', NOW()),
(18, 3, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-003', '2027-01-01', NOW()),
(18, 3, 'O', 'EARNED', 'PURCHASE_VIP', 100, 'activated', 'Bonus VIP transaksi besar ORD-2026-003', '2027-01-01', NOW()),
(18, 3, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-003', '2026-04-01', NOW()),
(19, 4, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-004', '2027-01-01', NOW()),
(19, 4, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-004', '2026-04-01', NOW()),
(20, 5, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-005', '2027-01-01', NOW()),
(20, 5, 'O', 'EARNED', 'PURCHASE_VIP', 100, 'activated', 'Bonus VIP transaksi besar ORD-2026-005', '2027-01-01', NOW()),
(20, 5, 'O', 'EARNED', 'PURCHASE_MEGA', 500, 'activated', 'Loyalty mega bonus ORD-2026-005', '2028-01-01', NOW()),
(20, 5, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-005', '2026-04-01', NOW()),
(21, 6, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-006', '2027-01-01', NOW()),
(21, 6, 'O', 'EARNED', 'PURCHASE_VIP', 100, 'activated', 'Bonus VIP ORD-2026-006', '2027-01-01', NOW()),
(21, 6, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-006', '2026-04-01', NOW()),
(22, 7, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-007', '2027-01-01', NOW()),
(22, 7, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-007', '2026-04-01', NOW()),
(23, 8, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-008', '2027-01-01', NOW()),
(24, 9, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-009', '2027-01-01', NOW()),
(24, 9, 'O', 'EARNED', 'PURCHASE_VIP', 100, 'activated', 'Bonus VIP ORD-2026-009', '2027-01-01', NOW()),
(24, 9, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-009', '2026-04-01', NOW()),
(27, 12, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-012', '2027-01-01', NOW()),
(27, 12, 'O', 'EARNED', 'PURCHASE_VIP', 100, 'activated', 'Bonus VIP ORD-2026-012', '2027-01-01', NOW()),
(27, 12, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-012', '2026-04-01', NOW()),
(29, 14, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-014', '2027-01-01', NOW()),
(29, 14, 'O', 'EARNED', 'PURCHASE_VIP', 100, 'activated', 'Bonus VIP ORD-2026-014', '2027-01-01', NOW()),
(29, 14, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-014', '2026-04-01', NOW()),
(30, 15, 'O', 'EARNED', 'PURCHASE_BASIC', 10, 'activated', 'Poin belanja ORD-2026-015', '2027-01-01', NOW()),
(30, 15, 'O', 'EARNED', 'NEW_YEAR_SURPRISE', 200, 'activated', 'Bonus awal tahun ORD-2026-015', '2026-04-01', NOW()),
-- Tabel Facilities_booking
(31, 1, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-07-11', '2026-01-12 13:00:00'),
(31, 1, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-12', '2026-01-12 13:00:00'),
(32, 2, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-07-17', '2026-01-18 19:00:00'),
(32, 2, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-18', '2026-01-18 19:00:00'),
(33, 3, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-07-12', '2026-01-13 10:00:00'),
(33, 3, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-13', '2026-01-13 10:00:00'),
(35, 5, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-06-30', '2026-01-01 08:00:00'),
(35, 5, 'F', 'EARNING', 'Facility_Booking_HighValue', 250, 'Active', 'Bonus sewa high value (>1jt)', '2026-06-30', '2026-01-01 08:00:00'),
(35, 5, 'F', 'EARNING', 'Facility_Booking_BigHall', 1000, 'Active', 'Bonus sewa aula besar (>5jt)', '2027-01-01', '2026-01-01 08:00:00'),
(35, 5, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-01', '2026-01-01 08:00:00'),
(35, 5, 'F', 'EARNING', 'New_Year_2026_Booking', 500, 'Active', 'Promo Double Poin Tahun Baru', '2026-04-01', '2026-01-01 08:00:00'),
(38, 8, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-07-14', '2026-01-15 13:00:00'),
(38, 8, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-15', '2026-01-15 13:00:00'),
(39, 9, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-06-30', '2026-01-01 15:00:00'),
(39, 9, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-01', '2026-01-01 15:00:00'),
(39, 9, 'F', 'EARNING', 'New_Year_2026_Booking', 500, 'Active', 'Promo Double Poin Tahun Baru', '2026-04-01', '2026-01-01 15:00:00'),
(43, 13, 'F', 'EARNING', 'Facility_Booking_Basic', 50, 'Active', 'Poin sewa fasilitas', '2026-06-30', '2026-01-01 18:00:00'),
(43, 13, 'F', 'EARNING', 'Facility_Booking_HighValue', 250, 'Active', 'Bonus sewa high value', '2026-06-30', '2026-01-01 18:00:00'),
(43, 13, 'F', 'EARNING', 'NEW_YEAR_SURPRISE', 200, 'Active', 'Bonus awal tahun 2026', '2026-04-01', '2026-01-01 18:00:00'),
(43, 13, 'F', 'EARNING', 'New_Year_2026_Booking', 500, 'Active', 'Promo Double Poin Tahun Baru', '2026-04-01', '2026-01-01 18:00:00');


-- ======================
-- 18. userpoints
-- ======================
INSERT INTO user_points (user_id, current_balance, total_earned) VALUES
(16, 210, 210),
(17, 210, 210),
(18, 310, 310),
(19, 210, 210),
(20, 810, 810),
(21, 310, 310),
(22, 210, 210),
(23, 10, 10),
(24, 310, 310),
(27, 310, 310),
(29, 310, 310),
(30, 210, 210),
(31, 250, 250),
(32, 250, 250),
(33, 250, 250),
(35, 2000, 2000),
(38, 250, 250),
(39, 750, 750),
(43, 1000, 1000);


-- ======================
-- 19. users_status
-- ======================
INSERT INTO users_status (name, description) VALUES
('Active', 'User bisa beraktifitas'),
('Suspend', 'User tidak dapat akses ke aktifitas event, namun masih bisa melihat status'),
('Inactive', 'User tidak dapat digunakan');

-- ======================
-- 20. sys_users_apppermissions
-- ======================
INSERT INTO `sys_users_apppermissions` (`perm_name`, `slug`, `description`) VALUES
-- Modul System (Hanya Super Admin)
('System settings', 'system_settings', 'Mengubah konfigurasi inti aplikasi dan API keys'),
('View logs', 'view_logs', 'Melihat log aktivitas seluruh admin'),
-- Modul Admin Management
('Manage admins', 'manage_admins', 'Menambah, edit, dan menghapus akun app_admins'),
('Manage roles', 'manage_roles', 'Mengatur hak akses dan role'),
-- Modul Event Operasional
('View events', 'view_events', 'Melihat daftar seluruh event'),
('Create events', 'create_events', 'Menambah event baru dari sisi internal'),
('Edit events', 'edit_events', 'Mengubah data event'),
('Delete events', 'delete_events', 'Menghapus data event'),
('Validate events', 'validate_events', 'Menyetujui atau menolak pengajuan event dari EO'),
-- Modul EO & User
('Manage eo', 'manage_eo', 'Verifikasi dan kelola data Event Organizer'),
('View users', 'view_users', 'Melihat data PIC/User EO'),
-- Modul Finance & Support
('View finance', 'view_finance', 'Melihat laporan keuangan dan transaksi tiket'),
('Manage payouts', 'manage_payouts', 'Menyetujui pencairan dana ke EO'),
('View support', 'view_support', 'Melihat dan membalas tiket bantuan/support');

-- ======================
-- 21. event_ticket
-- ======================
INSERT INTO `event_ticket` 
(`event_id`, `name`, `description`, `price`, `total_capacity`, `remaining_capacity`, `max_per_order`, `sales_start_date`, `sales_end_date`, `is_active`, `sort_order`) 
VALUES
(1, 'General Admission', 'Akses tribun standar', 150000.00, 1000, 850, 4, '2024-12-01', '2025-01-09', TRUE, 1),
(1, 'Regular Pass', 'Akses masuk standar 3 hari', 150000.00, 500, 500, 4, '2024-12-01', '2025-01-09', TRUE, 2),
(1, 'VIP Pass', 'Kursi depan + Skin Limited', 500000.00, 100, 20, 2, '2024-12-01', '2025-01-09', TRUE, 3),
(1, 'VIP Pro Player', 'Kursi depan + Exclusive Merchandise', 450000.00, 50, 50, 2, '2024-12-01', '2025-01-09', TRUE, 4),
(2, 'Daily Pass', 'Tiket harian', 200000.00, 300, 300, 5, '2025-01-01', '2025-02-14', TRUE, 1),
(2, 'Season Pass', 'Akses penuh selama 5 hari', 200000.00, 500, 400, 2, '2025-01-01', '2025-02-14', TRUE, 2),
(3, 'Workshop Entry', 'Termasuk lunch & sertifikat', 350000.00, 20, 0, 1, '2024-11-01', '2024-11-30', FALSE, 1),
(4, 'Webinar Access', 'Link Zoom & E-Certificate', 50000.00, 500, 300, 1, '2025-01-01', '2025-01-19', TRUE, 1),
(5, 'Early Bird', 'Promo pendaftaran awal', 750000.00, 50, 50, 2, '2025-02-01', '2025-03-04', TRUE, 1),
(6, 'Standard Seat', 'Kursi baris belakang', 1200000.00, 100, 5, 2, '2024-11-01', '2024-12-28', TRUE, 1),
(6, 'Festival Deck', 'Standing area', 1200000.00, 200, 10, 2, '2024-11-01', '2024-12-28', TRUE, 2),
(6, 'VVIP Table', 'Table for 4 + Wine', 8000000.00, 10, 2, 1, '2024-11-01', '2024-12-28', TRUE, 3),
(7, 'Entrance Ticket', 'Akses masuk pameran', 25000.00, 5000, 5000, 10, '2025-03-01', '2025-05-10', TRUE, 1),
(8, 'Team Slot', 'Pendaftaran per tim (5 orang)', 50000.00, 64, 32, 1, '2024-12-01', '2025-01-04', TRUE, 1),
(9, 'Full Course', 'Akses 2 hari workshop', 1500000.00, 30, 10, 1, '2025-01-01', '2025-02-09', TRUE, 1),
(10, 'Free Pass', 'Seminar gratis', 0.00, 100, 0, 1, '2024-11-01', '2024-11-19', FALSE, 1),
(11, 'Presale', 'Tiket terbatas', 450000.00, 500, 500, 4, '2025-01-01', '2025-05-01', TRUE, 1),
(11, 'Normal', 'Harga normal festival', 600000.00, 1000, 1000, 4, '2025-05-02', '2025-06-11', TRUE, 2),
(12, 'Cosplayer Pass', 'Khusus yang menggunakan cosplay', 75000.00, 500, 500, 2, '2025-06-01', '2025-07-19', TRUE, 1),
(12, 'Otaku Pass', 'Tiket pengunjung umum', 100000.00, 1500, 1500, 5, '2025-06-01', '2025-07-19', TRUE, 2),
(13, 'Entry Fee', 'Biaya turnamen online', 20000.00, 32, 0, 1, '2024-12-01', '2024-12-29', TRUE, 1),
(14, 'Professional', 'Termasuk modul digital', 500000.00, 100, 100, 2, '2025-03-01', '2025-04-11', TRUE, 1),
(15, 'General Admission', 'Gratis untuk mahasiswa', 0.00, 200, 150, 1, '2024-12-01', '2025-01-14 ', TRUE, 1),
(15, 'Free Entry', 'Untuk umum', 20000.00, 300, 250, 1, '2025-01-01', '2025-01-14', TRUE, 2),
(16, 'Festival A', 'Area depan panggung', 2500000.00, 200, 200, 2, '2025-07-01', '2025-09-08', TRUE, 1),
(16, 'Festival B', 'Area belakang', 1500000.00, 500, 500, 4, '2025-07-01', '2025-09-08', TRUE, 2),
(16, 'Cat 1 (Seated)', 'Tribun bawah', 2500000.00, 500, 500, 2, '2025-05-01', '2025-09-08', TRUE, 3),
(16, 'Cat 2 (Seated)', 'Tribun atas', 1500000.00, 1000, 1000, 4, '2025-05-01', '2025-09-08', TRUE, 4),
(16, 'Diamond (VIP)', 'Soundcheck experience', 5000000.00, 100, 100, 2, '2025-05-01', '2025-09-08', TRUE, 5),
(17, 'Visitor Ticket', 'Akses semua booth', 35000.00, 5000, 5000, 10, '2025-07-01', '2025-07-31', TRUE, 1),
(18, 'Pendaftaran', 'Turnamen offline', 100000.00, 48, 0, 1, '2024-12-01', '2024-12-24', FALSE, 1),
(19, 'Seat', 'Alat dan bahan disediakan', 400000.00, 15, 5, 1, '2024-12-15', '2025-01-17', TRUE, 1),
(20, 'Tiket Seminar', 'Akses seminar kesehatan', 150000.00, 100, 100, 2, '2025-01-10', '2025-02-04', TRUE, 1),
(21, 'Daily Pass', 'Akses konser indie', 150000.00, 300, 300, 5, '2025-02-01', '2025-03-19', TRUE, 1),
(22, 'Weekday Pass', 'Berlaku Senin-Kamis', 40000.00, 2000, 2000, 5, '2025-08-01', '2025-10-19', TRUE, 1),
(22, 'Weekend Pass', 'Berlaku Jumat-Minggu', 100000.00, 3000, 3000, 5, '2025-08-01', '2025-10-19', TRUE, 2),
(23, 'Free Registration', 'Turnamen via Lichess', 0.00, 100, 88, 1, '2024-12-25', '2025-01-07', TRUE, 1),
(23, 'Entry Ticket', 'Pendaftaran turnamen online', 0.00, 128, 128, 1, '2024-12-20 00:00', '2025-01-07 23:59', TRUE, 2),
(24, 'Full Day Pass', 'Workshop intensif', 850000.00, 25, 0, 1, '2024-09-01', '2024-10-09', FALSE, 1),
(25, 'Guest', 'Akses diskusi eksklusif', 0.00, 50, 20, 1, '2025-03-01', '2025-04-14', TRUE, 1),
(26, 'Standard Entry', 'First drink charge included', 300000.00, 200, 150, 4, '2024-12-10', '2024-12-30', TRUE, 1),
(27, 'Free Access', 'Wajib daftar online', 0.00, 10000, 10000, 5, '2025-05-01', '2025-05-31', TRUE, 1),
(27, 'Free Entry', 'Tiket masuk gratis (Registrasi tetap wajib)', 0.00, 10000, 10000, 5, '2025-01-01', '2025-06-01', TRUE, 2),
(28, 'Competitor', 'Pendaftaran pemain', 75000.00, 32, 10, 1, '2025-01-01', '2025-01-24', TRUE, 1),
(29, 'Class Slot', 'Bahan & hasil panggangan dibawa pulang', 600000.00, 10, 2, 1, '2025-02-01', '2025-03-11', TRUE, 1),
(30, 'Online Ticket', 'Link streaming seminar', 0.00, 1000, 900, 1, '2025-04-01', '2025-05-19', TRUE, 1);

-- ======================
-- 22. user_tickets
-- ======================
DELETE FROM `user_tickets`;
INSERT INTO `user_tickets` 
(`user_id`, `order_items_id`, `ticket_code`, `status`, `check_in_at`, `check_in_by`) 
VALUES
(16, 1, 'TIX-ORD1-TK1-01', 'VALID', NULL, NULL),
(16, 1, 'TIX-ORD1-TK1-02', 'VALID', NULL, NULL),
(16, 3, 'TIX-ORD1-TK3-01', 'VALID', NULL, NULL),
(17, 2, 'TIX-ORD2-TK2-01', 'VALID', NULL, NULL),
(18, 4, 'TIX-ORD3-TK4-01', 'VALID', NULL, NULL),
(18, 4, 'TIX-ORD3-TK4-02', 'VALID', NULL, NULL),
(18, 3, 'TIX-ORD3-TK3-01', 'VALID', NULL, NULL),
(19, 5, 'TIX-ORD4-TK5-01', 'VALID', NULL, NULL),
(20, 12, 'TIX-ORD5-TK12-01', 'VALID', NULL, NULL),
(21, 10, 'TIX-ORD6-TK10-01', 'VALID', NULL, NULL),
(21, 8, 'TIX-ORD6-TK8-01', 'VALID', NULL, NULL),
(21, 8, 'TIX-ORD6-TK8-02', 'VALID', NULL, NULL),
(21, 8, 'TIX-ORD6-TK8-03', 'VALID', NULL, NULL),
(21, 8, 'TIX-ORD6-TK8-04', 'VALID', NULL, NULL),
(21, 8, 'TIX-ORD6-TK8-05', 'VALID', NULL, NULL),
(21, 13, 'TIX-ORD6-TK13-01', 'VALID', NULL, NULL),
(21, 13, 'TIX-ORD6-TK13-02', 'VALID', NULL, NULL),
(21, 13, 'TIX-ORD6-TK13-03', 'VALID', NULL, NULL),
(21, 13, 'TIX-ORD6-TK13-04', 'VALID', NULL, NULL),
(22, 4, 'TIX-ORD7-TK4-01', 'VALID', NULL, NULL),
(23, 14, 'TIX-ORD8-TK14-01', 'VALID', NULL, NULL),
(24, 11, 'TIX-ORD9-TK11-01', 'VALID', NULL, NULL),
(24, 11, 'TIX-ORD9-TK11-02', 'VALID', NULL, NULL),
(25, 6, 'TIX-ORD10-TK6-01', 'VALID', NULL, NULL),
(25, 20, 'TIX-ORD10-TK20-01', 'VALID', NULL, NULL),
(25, 20, 'TIX-ORD10-TK20-02', 'VALID', NULL, NULL),
(26, 19, 'TIX-ORD11-TK19-01', 'VALID', NULL, NULL),
(26, 13, 'TIX-ORD11-TK13-01', 'VALID', NULL, NULL),
(26, 13, 'TIX-ORD11-TK13-02', 'VALID', NULL, NULL),
(27, 15, 'TIX-ORD12-TK15-01', 'VALID', NULL, NULL),
(27, 15, 'TIX-ORD12-TK15-02', 'VALID', NULL, NULL),
(28, 16, 'TIX-ORD13-TK16-01', 'VALID', NULL, NULL),
(29, 17, 'TIX-ORD14-TK17-01', 'VALID', NULL, NULL),
(29, 17, 'TIX-ORD14-TK17-02', 'VALID', NULL, NULL),
(29, 19, 'TIX-ORD14-TK19-01', 'VALID', NULL, NULL),
(29, 20, 'TIX-ORD14-TK20-01', 'VALID', NULL, NULL),
(30, 3, 'TIX-ORD15-TK3-01', 'VALID', NULL, NULL);

-- ======================
-- 23. sys_userticket_status
-- ======================
INSERT INTO sys_userticket_status (name, display_name, description, color_code) VALUES
('PENDING', 'Menunggu Pembayaran', 'Tiket telah dipesan namun pembayaran belum dikonfirmasi', '#FFC107'),
('VALID', 'Siap Digunakan', 'Tiket aktif dan dapat digunakan untuk masuk ke acara', '#28A745'),
('USED', 'Sudah Digunakan', 'Peserta telah melakukan check-in di lokasi', '#007BFF'),
('CANCELLED', 'Dibatalkan', 'Tiket dibatalkan oleh sistem atau pengguna', '#DC3545'),
('REFUNDED', 'Dikembalikan', 'Tiket tidak berlaku karena dana telah dikembalikan', '#6C757D');

-- ======================
-- 24. orders_status
-- ======================
INSERT INTO `orders_status` (`name`, `display_name`, `description`, `color_code`) VALUES
('Pending', 'Menunggu Pembayaran', 'Pesanan telah dibuat tetapi pembayaran belum diterima oleh sistem.', '#FFA500'),
('waiting_verification', 'Menunggu Verifikasi', 'Pembayaran telah dikirim oleh pengguna dan sedang diverifikasi manual oleh admin.', '#1E90FF'),
('paid', 'Lunas', 'Pembayaran telah berhasil dikonfirmasi dan tiket resmi diterbitkan.', '#28A745'),
('expired', 'Kadaluarsa', 'Batas waktu pembayaran telah habis sebelum pengguna melakukan transaksi.', '#6C757D'),
('cancelled', 'Dibatalkan', 'Pesanan dibatalkan oleh pengguna atau sistem karena alasan tertentu.', '#DC3545'),
('refunded', 'Dikembalikan', 'Dana pesanan telah dikembalikan kepada pengguna (biasanya karena event batal).', '#6F42C1'),
('failed', 'Gagal', 'Transaksi gagal diproses oleh payment gateway.', '#BD2130');

-- ======================
-- 25. orders
-- ======================
DELETE FROM `orders`;
INSERT INTO `orders` (`id`, `user_id`, `order_code`, `total_amount`, `status`, `payment_method`) VALUES
-- VIP Members
(1 , 16, 'ORD-2026-001', 800000.00, 'paid', 'Bank Transfer'),
(2 , 17, 'ORD-2026-002', 150000.00, 'paid', 'E-Wallet'),
(3 , 18, 'ORD-2026-003', 1400000.00, 'paid', 'Credit Card'),
(4 , 19, 'ORD-2026-004', 200000.00, 'paid', 'Bank Transfer'),
(5 , 20, 'ORD-2026-005', 8000000.00, 'paid', 'Redeem Point'),
(6 , 21, 'ORD-2026-006', 1550000.00, 'paid', 'E-Wallet'),
(7 , 22, 'ORD-2026-007', 450000.00, 'paid', 'Bank Transfer'),
(8 , 23, 'ORD-2026-008', 50000.00, 'paid', 'E-Wallet'),
(9 , 24, 'ORD-2026-009', 2400000.00, 'paid', 'Credit Card'),
(10, 25, 'ORD-2026-010', 400000.00, 'paid', 'Bank Transfer'),
(11, 26, 'ORD-2026-011', 125000.00, 'paid', 'E-Wallet'),
(12, 27, 'ORD-2026-012', 3000000.00, 'paid', 'Bank Transfer'),
(13, 28, 'ORD-2026-013', 0.00, 'paid', 'Free'),
(14, 29, 'ORD-2026-014', 1050000.00, 'paid', 'Bank Transfer'),
(15, 30, 'ORD-2026-015', 500000.00, 'paid', 'E-Wallet');

-- ======================
-- 26. order_items
-- ======================
DELETE FROM `order_items`;
INSERT INTO `order_items` (`order_id`, `event_ticket_id`, `event_date`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1, '2026-01-01 00:00:00', 2, 150000.00, 300000.00),
(1, 3, '2026-01-01 00:00:00', 1, 500000.00, 500000.00),

(2, 2, '2026-01-01 00:00:00', 1, 150000.00, 150000.00),
(3, 4, '2026-01-01 00:00:00', 2, 450000.00, 900000.00),
(3, 3, '2026-01-01 00:00:00', 1, 500000.00, 500000.00),
(4, 5, '2026-01-01 00:00:00', 1, 200000.00, 200000.00),
(5, 12, '2026-01-01 00:00:00', 1, 8000000.00, 8000000.00),
(6, 10, '2026-01-01 00:00:00', 1, 1200000.00, 1200000.00),
(6, 8, '2026-01-01 00:00:00', 5, 50000.00, 250000.00),
(6, 13, '2026-01-01 00:00:00', 4, 25000.00, 100000.00),
(7, 4, '2026-01-01 00:00:00', 1, 450000.00, 450000.00),
(8, 14, '2026-01-01 00:00:00', 1, 50000.00, 50000.00),
(9, 11, '2026-01-01 00:00:00', 2, 1200000.00, 2400000.00),
(10, 6, '2026-01-01 00:00:00', 1, 200000.00, 200000.00),
(10, 20, '2026-01-01 00:00:00', 2, 100000.00, 200000.00),
(11, 19, '2026-01-01 00:00:00', 1, 75000.00, 75000.00),
(11, 13, '2026-01-01 00:00:00', 2, 25000.00, 50000.00),
(12, 15, '2026-01-01 00:00:00', 2, 1500000.00, 3000000.00),
(13, 16, '2026-01-01 00:00:00', 1, 0.00, 0.00),
(14, 17, '2026-01-01 00:00:00', 2, 450000.00, 900000.00),
(14, 19, '2026-01-01 00:00:00', 1, 75000.00, 75000.00),
(14, 20, '2026-01-01 00:00:00', 1, 75000.00, 75000.00),
(15, 3, '2026-01-01 00:00:00', 1, 500000.00, 500000.00);

-- ======================
-- 27. facilities
-- ======================
DELETE FROM `facilities`;
INSERT INTO `facilities` 
(`events_organizer_id`, `user_id_pic`, `name`, `category`, `description`, `is_available`) 
VALUES
(1, 1, 'Main Arena Stage', 'Gaming', 'Panggung utama untuk turnamen esport dengan kapasitas 10 PC High-end.', TRUE),
(1, 2, 'Streaming Room A', 'Gaming', 'Ruangan kedap suara khusus untuk broadcast dan shoutcaster.', TRUE),
(1, 2, 'PS5 Private Lounge', 'Gaming', 'Area santai dengan 4 unit PS5 dan kursi gaming premium.', TRUE),
(1, 2, 'PS5 Unit 1', 'Gaming', 'Unit 1 - PS5 dan kursi gaming premium.', TRUE),
(1, 2, 'PS5 Unit 2', 'Gaming', 'Unit 2 - PS5 dan kursi gaming premium.', TRUE),
(1, 2, 'PS5 Unit 3', 'Gaming', 'Unit 3 - PS5 dan kursi gaming premium.', TRUE),
(2, 3, 'Photo Studio 1', 'Others', 'Studio foto dengan peralatan lighting lengkap dan background kustom.', TRUE),
(2, 3, 'Photo Studio 2', 'Others', 'Studio foto dengan peralatan lighting lengkap dan background kustom.', TRUE),
(2, 3, 'Photo Studio 3', 'Others', 'Studio foto dengan peralatan lighting lengkap dan background kustom.', TRUE),
(2, 3, 'Photo Studio 4', 'Others', 'Studio foto dengan peralatan lighting lengkap dan background kustom.', TRUE),
(2, 4, 'Creative Workshop Space', 'Others', 'Ruangan kolaborasi untuk kelas desain dan seni.', TRUE),
(2, 3, 'Podcast Studio', 'Music', 'Ruang rekaman audio dengan mikrofon kondensor standar industri.', FALSE),
(3, 5, 'Main Hall Auditorium', 'Others', 'Aula utama untuk seminar teknologi kapasitas 200 orang.', TRUE),
(3, 6, 'Coding Lab', 'Gaming', 'Fasilitas komputer untuk workshop pemrograman dan hackathon.', TRUE),
(3, 5, 'Networking Lounge', 'Others', 'Area terbuka untuk diskusi dan networking peserta.', TRUE),
(4, 7, 'Rehearsal Studio', 'Music', 'Ruang latihan band lengkap dengan instrumen dan sound system.', TRUE),
(4, 7, 'Recording Booth', 'Music', 'Ruang khusus vokal untuk kebutuhan dubbing atau rekaman lagu.', TRUE),
(4, 8, 'Mini Concert Stage', 'Music', 'Panggung kecil untuk penampilan akustik atau showcase artis.', TRUE),
(5, 9, 'Exhibition Hall A', 'Others', 'Area luas tanpa sekat untuk pameran produk internasional.', TRUE),
(5, 10, 'VIP Meeting Room', 'Others', 'Ruangan eksklusif untuk negosiasi bisnis dan pertemuan VIP.', TRUE),
(5, 9, 'Outdoor Basketball Court', 'Sports', 'Lapangan basket standar FIBA di area luar gedung.', TRUE);

-- ======================
-- 28. facility_pricing
-- ======================

INSERT INTO `facility_pricing` (`facility_id`, `day_type`, `start_time`, `end_time`, `price_per_hour`) VALUES
(1, 'Weekday', '08:00:00', '22:00:00', 150000.00),
(1, 'Weekend', '08:00:00', '23:59:00', 200000.00),
(1, 'Holiday', '08:00:00', '23:59:00', 250000.00),
(2, 'Weekday', '08:00:00', '22:00:00', 75000.00),
(2, 'Weekend', '08:00:00', '22:00:00', 100000.00),
(2, 'Holiday', '08:00:00', '22:00:00', 125000.00),
(3, 'Weekday', '10:00:00', '22:00:00', 50000.00),
(3, 'Weekend', '10:00:00', '23:00:00', 75000.00),
(3, 'Holiday', '10:00:00', '23:00:00', 90000.00),
(4, 'Weekday', '08:00:00', '18:00:00', 200000.00),
(4, 'Weekend', '08:00:00', '20:00:00', 300000.00),
(4, 'Holiday', '09:00:00', '20:00:00', 350000.00),
(5, 'Weekday', '09:00:00', '17:00:00', 100000.00),
(5, 'Weekend', '09:00:00', '17:00:00', 150000.00),
(5, 'Holiday', '09:00:00', '17:00:00', 175000.00),
(6, 'Weekday', '08:00:00', '21:00:00', 125000.00),
(6, 'Weekend', '08:00:00', '21:00:00', 150000.00),
(6, 'Holiday', '08:00:00', '21:00:00', 175000.00),
(7, 'Weekday', '08:00:00', '22:00:00', 1000000.00),
(7, 'Weekend', '08:00:00', '22:00:00', 1500000.00),
(7, 'Holiday', '08:00:00', '22:00:00', 2000000.00),
(8, 'Weekday', '08:00:00', '20:00:00', 500000.00),
(8, 'Weekend', '08:00:00', '20:00:00', 600000.00),
(8, 'Holiday', '08:00:00', '20:00:00', 750000.00),
(9, 'Weekday', '09:00:00', '22:00:00', 250000.00),
(9, 'Weekend', '09:00:00', '22:00:00', 350000.00),
(9, 'Holiday', '09:00:00', '22:00:00', 400000.00),
(10, 'Weekday', '10:00:00', '23:00:00', 80000.00),
(10, 'Weekend', '10:00:00', '23:59:00', 100000.00),
(10, 'Holiday', '10:00:00', '23:59:00', 120000.00),
(11, 'Weekday', '09:00:00', '20:00:00', 150000.00),
(11, 'Weekend', '09:00:00', '20:00:00', 200000.00),
(11, 'Holiday', '09:00:00', '20:00:00', 250000.00),
(12, 'Weekday', '13:00:00', '23:00:00', 400000.00),
(12, 'Weekend', '10:00:00', '23:59:00', 600000.00),
(12, 'Holiday', '10:00:00', '23:59:00', 800000.00),
(13, 'Weekday', '07:00:00', '22:00:00', 2000000.00),
(13, 'Weekend', '07:00:00', '22:00:00', 3000000.00),
(13, 'Holiday', '07:00:00', '22:00:00', 4500000.00),
(14, 'Weekday', '08:00:00', '18:00:00', 500000.00),
(14, 'Weekend', '08:00:00', '18:00:00', 700000.00),
(14, 'Holiday', '08:00:00', '18:00:00', 850000.00),
(15, 'Weekday', '06:00:00', '21:00:00', 100000.00),
(15, 'Weekend', '06:00:00', '22:00:00', 150000.00),
(15, 'Holiday', '06:00:00', '22:00:00', 200000.00);

-- ======================
-- 29. facility_bookings
-- ======================
INSERT INTO `facility_bookings` 
(`user_id`, `facility_id`, `facility_code`, `booking_date`, `start_time`, `end_time`, `total_hours`, `total_price`, `status`) 
VALUES
(31, 1, 'FAC-2026-001', '2026-01-12', '13:00:00', '15:30:00', 2.50, 375000.00, 'Completed'),
(32, 3, 'FAC-2026-001', '2026-01-18', '19:00:00', '22:00:00', 3.00, 225000.00, 'Completed'),
(33, 4, 'FAC-2026-001', '2026-01-13', '10:00:00', '12:00:00', 2.00, 400000.00, 'Completed'),
(34, 6, 'FAC-2026-001', '2026-01-17', '14:00:00', '16:00:00', 2.00, 300000.00, 'Confirmed'),
(35, 7, 'FAC-2026-001', '2026-01-01', '08:00:00', '13:00:00', 5.00, 10000000.00, 'Completed'),
(36, 8, 'FAC-2026-001', '2026-01-14', '08:00:00', '12:00:00', 4.00, 2000000.00, 'Confirmed'),
(37, 15, 'FAC-2026-001', '2026-01-11', '16:00:00', '18:00:00', 2.00, 300000.00, 'Cancelled'),
(38, 2, 'FAC-2026-001', '2026-01-15', '13:00:00', '17:00:00', 4.00, 300000.00, 'Completed'),
(39, 11, 'FAC-2026-001', '2026-01-01', '15:00:00', '17:00:00', 2.00, 500000.00, 'Completed'),
(40, 14, 'FAC-2026-001', '2026-01-16', '09:00:00', '12:00:00', 3.00, 1500000.00, 'Pending'),
(41, 5, 'FAC-2026-001', '2026-01-25', '10:00:00', '15:00:00', 5.00, 750000.00, 'Confirmed'),
(42, 9, 'FAC-2026-001', '2026-01-20', '18:00:00', '20:30:00', 2.50, 625000.00, 'Pending'),
(43, 12, 'FAC-2026-001', '2026-01-01', '18:00:00', '22:00:00', 4.00, 3200000.00, 'Completed'),
(44, 13, 'FAC-2026-001', '2026-01-21', '08:00:00', '18:00:00', 10.00, 20000000.00, 'Confirmed'),
(45, 1, 'FAC-2026-001', '2026-01-24', '20:00:00', '22:00:00', 2.00, 400000.00, 'Pending');

-- ======================
-- 30. facilitybooking_status
-- ======================
INSERT INTO `facilitybooking_status` (`name`, `display_name`, `description`, `color_code`) VALUES
('Pending', 'Menunggu Pembayaran', 'Pesanan telah dibuat tetapi pembayaran belum diterima oleh sistem.', '#FFA500'),
('confirmed', 'Konfirm', 'Konfirm akan hadir', '#1E90FF'),
('completed', 'Selesai', 'Telah selesai melaksanakan event / menggunakan fasilitas', '#28A745'),
('cancelled', 'Dibatalkan', 'Pesanan dibatalkan oleh pengguna atau sistem karena alasan tertentu.', '#DC3545');


