
insert into ztbd.index_company (index_name, full_name) values ('nvda_us', 'NVIDIA Corp');

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume) 
from '/root/data/cass_nvda_us_d.csv';


insert into ztbd.index_company (index_name, full_name) values ('intc_us', 'Intel Corp');

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume) 
from '/root/data/cass_intc_us_d.csv';


insert into ztbd.index_company (index_name, full_name) values ('amd_us', 'Advanced Micro Devices Inc');

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume) 
from '/root/data/cass_amd_us_d.csv';
