const form = document.getElementById('form');
const urldisplay = document.getElementById('urldisplay')
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formdata = new FormData(form);
    console.log(Array.from(formdata));

    try {
        const res = await fetch('/', {
            method: 'POST',
            body: formdata
        });

        if (res.ok) {
            const link = await res.text();
            urldisplay.innerHTML = window.location.href + link;
        } else {
            urldisplay.innerHTML = 'Failed to create link';
        }
    }
    catch (err) {
        console.error(err);
    }
});