const roomDescriptions = {
    standard: 'Standard room with basic amenities',
    standrad: 'Standard room with basic amenities',
    superior: 'Superior room with additional features',
    deluxe: 'Deluxe room with additional amenities',
    delux: 'Deluxe room with additional amenities',
    studio: 'Studio room with modern design and kitchenette',
    suite: 'Suite with separate living room',
    suited: 'Suite with separate living room'
};

document.querySelectorAll('.list > li').forEach((room) => {
    const name = room.querySelector('h2')?.textContent.trim().toLowerCase().replace(/\s+room$/, '');
    const description = 
    roomDescriptions[name];

    if (description) {
        const paragraph = document.createElement('p');
        paragraph.textContent = description;
        room.append(paragraph);
    }
});
