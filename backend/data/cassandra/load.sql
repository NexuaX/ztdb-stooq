
insert into ztbd.indexes (index_name, full_name) values ('nvda_us', 'NVIDIA Corp');
insert into ztbd.indexes (index_name, full_name) values ('aapl_us', 'Apple Inc');
insert into ztbd.indexes (index_name, full_name) values ('akam_us', 'Akamai Technologies Inc');
insert into ztbd.indexes (index_name, full_name) values ('amd_us', 'Advanced Micro Devices Inc');
insert into ztbd.indexes (index_name, full_name) values ('amzn_us', 'Amazon.com Inc');
insert into ztbd.indexes (index_name, full_name) values ('ibm_us', 'International Business Machines Corp');
insert into ztbd.indexes (index_name, full_name) values ('intc_us', 'Intel Corp');
insert into ztbd.indexes (index_name, full_name) values ('spx', 'S&P 500 - U.S.');

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_nvda_us_d.csv';

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_aapl_us_d.csv';

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_amd_us_d.csv';

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_akam_us_d.csv';

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_amzn_us_d.csv';

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_ibm_us_d.csv';

copy ztbd.index_company_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_intc_us_d.csv';

copy ztbd.index_data (index_name, day, opening, highest, lowest, closing, volume, garbage) 
from '/root/data/cass_spx_d.csv';
