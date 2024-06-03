const fs = require('fs');

function transformHeroesData(heroes) {
    return heroes.map((hero) => ({
        admin: hero.handle,
        hero_id: hero.id,
        imageUrl: hero.profile_image_url_https,
        name: hero.handle,
        description: hero.description,
    }));
}

fs.readFile('heroes.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }
    try {
        const heroes = JSON.parse(data);
        const transformedData = transformHeroesData(heroes);

        // Write the transformed data to a new JSON file
        fs.writeFile('chats.json', JSON.stringify(transformedData, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
            } else {
                console.log('Transformed data saved to output.json');
            }
        });
    } catch (err) {
        console.error('Error parsing JSON:', err);
    }
});
