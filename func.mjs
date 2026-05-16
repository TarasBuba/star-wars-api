import fs from 'fs/promises';

async function fetchAllFromDatabank(
 section, url = `https://starwars-databank-server.onrender.com/api/v1/${section}?page=1&limit=100`
) {
  const allData = [];
  while (url) {
    const response = await fetch(url);
    const data = await response.json();
    if (!data || !data.data) return allData;
    console.log(section, data);
    allData.push(...data.data);
    if (data.info.next) {
      url = `https://starwars-databank-server.onrender.com${data.info.next}`;
    } else {
      url = null;
    }
  }
  return allData;
}

async function enrichWithImages(section) {
  const charactersData = JSON.parse(
    await fs.readFile(`./data/${section}.json`, 'utf-8')
  );

  const allData = await fetchAllFromDatabank(section);

  const enrichedData = charactersData.map((character) => {
    const foundCharacter = allData.find((item) => item.name === character.name);
    return {
      ...character,
      image: character.image || foundCharacter?.image || null,
    };
  });

  await fs.writeFile(
    `./data/${section}.json`,
    JSON.stringify(enrichedData, null, 2)
  );

  return enrichedData;
}





 async function runAll() {
  const sections = [
    'characters',
    'films',
    'planets',
    'species',
    'starships',
    'vehicles',
    'organizations',
    'events',
    'weapons',
    'quotes',
  ];

  for (const section of sections) {
    await enrichWithImages(section);
  }
 }


runAll().catch(console.error);
