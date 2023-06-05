const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function scrap(name) {
  if (!name) {
    console.log('Podaj nazwę w argumencie');
    return;
  }
  let flag = true;
  let allData = [];
  let currentPage = 1;
  let host = 'https://stooq.pl/q/d/?s=' + name;

  while (flag) {
    const response = await axios.get(host, {
      headers: {
        Cookie: `FCCDCF=%5Bnull%2Cnull%2Cnull%2C%5B%22CPoda0APoda0AEsABBPLC7CoAP_AAG_AAB5YINJB7D7FbSFCyP57aLsAMAhXRkCAQqQCAASBAmABQAKQIAQCkkAYFESgBAACAAAgIAJBIQIMCAgACUABQAAAAAEEAAAABAAIIAAAgAEAAAAIAAACAIAAEAAIAAAAEAAAmQhAAIIACAAAhAAAIAAAAAAAAAAAAgCAAAAAAAAAAAAAAAAAAQQaQD2F2K2kKEkfjWUWYAQBCujIEAhUAEAAECBIAAAAUgQAgFIIAwAIlACAAAAABAQAQCQgAQABAAAoACgAAAAAAAAAAAAAAQQAABAAIAAAAAAAAEAQAAIAAQAAAAAAABEhCAAQQAEAAAAAAAQAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAgAA.f-gAAAAAAAA%22%2C%221~2072.70.89.93.108.122.149.196.2253.2299.259.2357.311.317.323.2373.338.358.2415.415.2506.2526.482.486.494.495.2568.2571.2575.540.574.2624.624.2677.827.864.981.1048.1051.1095.1097.1171.1201.1205.1276.1301.1365.1415.1449.1570.1577.1651.1716.1753.1765.1870.1878.1889.1958.2012%22%2C%22F99D9CA5-0B8A-4B92-9BDE-A38B03AC3E43%22%5D%2Cnull%2Cnull%2C%5B%5D%5D; FCNEC=%5B%5B%22AKsRol8R0ia5kdoC-IpGjWNxUb3kUTAzpQReYR-YIA9sepmnUptYRHzIgYDhvx7LqK3w2L9LQXcoYCjaeLagbMLnPPqI0vmq0wIJf_SuHsEHNsqGd75qkUQpFpDmP5_JBF5bf-n2yfsYdsiPWw6QMAtqX4GkjVR1Cg%3D%3D%22%5D%2Cnull%2C%5B%5D%5D; uid=plcd30dvw7paf6eo8wsh0ge9mz; cookie_user=%3F0001dllg000011540d1300e3%7Cakam.us+aapl.us; cookie_uu=230605000; PHPSESSID=kcmqh5h9mpsmu6n8g6j7v7dhs0`,
      },
    });
    const html = response.data;
    const $ = cheerio.load(html);

    const table = $('#fth1');
    const trs = table.find('tbody tr');

    trs.each((index, tr) => {
      const tds = $(tr).find('td');

      let oneRowData = [];
      tds.each((key, td) => {
        const text = key == 1 ? convertDateFormat($(td).text()) : $(td).text();
        oneRowData.push(text);
      });
      allData.push(oneRowData.slice(1));
      oneRowData = [];
    });
    console.log(allData.length);

    const anotherFile = $('tr#r td#f13 a').eq(2).attr('href');
    const newPageRegex = anotherFile?.match(/&l=(\d+)/);
    if (newPageRegex) newPage = newPageRegex[1];
    else newPage = 0;
    if (parseInt(currentPage, 10) < parseInt(newPage, 10)) {
      host = 'https://stooq.pl/' + anotherFile;
      currentPage = newPage;
      console.log(host);
    } else {
      flag = false;
    }
  }

  const csvContent = allData.map((row) => row.join(',')).join('\n');
  saveToFile(csvContent);
}

function saveToFile(content) {
  const filename = `${process.argv[2].replace('.', '_')}_d.csv`;
  fs.writeFile(filename, content, (err) => {
    if (err) {
      console.error('Błąd podczas zapisywania pliku:', err);
      return;
    }
    console.log('Plik został zapisany pomyślnie.');
  });
}
function convertDateFormat(dateString) {
  const months = {
    sty: '01', // styczeń
    lut: '02', // luty
    mar: '03', // marzec
    kwi: '04', // kwiecień
    maj: '05', // maj
    cze: '06', // czerwiec
    lip: '07', // lipiec
    sie: '08', // sierpień
    wrz: '09', // wrzesień
    paź: '10', // październik
    lis: '11', // listopad
    gru: '12', // grudzień
  };

  const [day, month, year] = dateString.split(' ');
  const monthNumber = months[month.toLowerCase().substring(0, 3)];
  const formattedDate = `${year}-${monthNumber}-${day}`;

  return formattedDate;
}
scrap(process.argv[2]);
