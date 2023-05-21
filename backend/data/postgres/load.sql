
insert into indexes (index_name, full_name) values ('nvda_us', 'NVIDIA Corp');
\copy index_data(index_id, day, closing, highest, lowest, opening, volume) from '/root/data/pg_nvda_us_d.csv' with (format csv)

insert into indexes (index_name, full_name) values ('intc_us', 'Intel Corp');
\copy index_data(index_id, day, closing, highest, lowest, opening, volume) from '/root/data/pg_intc_us_d.csv' with (format csv)

insert into indexes (index_name, full_name) values ('amd_us', 'Advanced Micro Devices Inc');
\copy index_data(index_id, day, closing, highest, lowest, opening, volume) from '/root/data/pg_amd_us_d.csv' with (format csv)
