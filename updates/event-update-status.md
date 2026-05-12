Saya memiliki aplikasi event ticketing menggunakan:

* Frontend: Next.js
* Backend API: CodeIgniter 4
* Database: MySQL

Aplikasi sudah production dan saya hanya ingin perubahan pada FLOW STATUS EVENT saja.

JANGAN:

* tambah tabel baru
* refactor database besar
* ubah architecture existing

Gunakan table existing:

* events
* event_ticket

========================================
DATABASE STATUS
===============

Gunakan hanya 3 status database pada:
events.events_status

* Draft
* Launch
* Closed

JANGAN menambah status database baru.

========================================
STATUS DASHBOARD
================

Status dashboard BUKAN disimpan ke database.

Status dashboard dihitung realtime berdasarkan:

* current datetime
* event start_date
* event end_date
* ticket remaining_capacity

Status dashboard:

* Upcoming
* Ongoing
* Sold Out
* Finished

========================================
STATUS FLOW
===========

Draft
↓
Launch
↓
Closed

========================================
RULES
=====

DRAFT

* event tidak tampil di landing page
* ticket tidak bisa dibeli
* EO masih bisa edit event

LAUNCH

* event tampil di landing page
* ticket dapat dibeli
* status dashboard realtime otomatis

CLOSED

* event tidak tampil di landing page
* checkout disabled
* ticket tidak bisa dibeli
* event tetap tampil di dashboard EO dengan status Closed

========================================
DYNAMIC STATUS RULES
====================

UPCOMING
Jika:

* events_status = Launch
* now < start_date
* ticket masih tersedia

ONGOING
Jika:

* now >= start_date
* now <= end_date

SOLD OUT
Jika:

* SUM(remaining_capacity) = 0
* sebelum event dimulai

FINISHED
Jika:

* now > end_date

========================================
STATUS PRIORITY
===============

1. Closed
2. Sold Out
3. Ongoing
4. Finished
5. Upcoming

========================================
SOLD OUT QUERY
==============

SELECT SUM(remaining_capacity)
FROM event_ticket
WHERE event_id = ?

Jika hasil:
0

Maka:
dashboard_status = Sold Out

========================================
LANDING PAGE RULES
==================

Landing page hanya menampilkan:
events_status = 'Launch'

Event dengan status:

* Draft
* Closed

Tidak boleh tampil.

========================================
YANG SAYA BUTUHKAN
==================

Buatkan implementation workflow lengkap khusus untuk perubahan status event meliputi:

1. Admin panel status flow
2. Landing page status flow
3. Realtime dashboard status logic
4. Backend CI4 status service
5. Frontend Next.js badge logic
6. Query optimization
7. Pseudocode status calculation
8. Suggested clean architecture
9. Production-safe implementation
10. Realtime websocket update flow
11. Error handling scenario
12. Suggested API response structure

Gunakan:

* clean architecture
* scalable approach
* production-ready implementation
* minimal database change
* compatible existing production system
