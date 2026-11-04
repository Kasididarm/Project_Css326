const roomTypeImages = {
    
    standard: 'messageImage_1793708464561.jpg',
    deluxe: 'messageImage_1793708743049.jpg',
    superior: 'images.jpg',
    suite: 'images (1).jpg',
    studio: 'images (2).jpg'
};

async function loadRoomTypes() {
    const list = document.getElementById('room-type-list');
    const message = document.getElementById('room-type-message');

    try {
        const response = await fetch('/hotel/room-types');
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`);
        }

        const roomTypes = await response.json();
        list.replaceChildren();

        roomTypes.forEach((roomType) => {
            const item = document.createElement('li');
            const title = document.createElement('h2');
            const image = document.createElement('img');
            const description = document.createElement('p');
            const price = document.createElement('p');

            title.textContent = roomType.name;
            image.src = roomTypeImages[roomType.name.toLowerCase()] || '';
            image.alt = `${roomType.name} room`;
            description.textContent = roomType.description;
            price.textContent = `Price: $${Number(roomType.price).toFixed(2)} per night`;

            item.append(title, image, description, price);
            list.append(item);
        });

        message.textContent = roomTypes.length ? '' : 'No room types found.';
    } catch (error) {
        console.error('Unable to load room types:', error);
        message.textContent = 'Could not load room types. Please try again later.';
    }
}

loadRoomTypes();
