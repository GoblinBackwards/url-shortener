const form = document.getElementById('form');
const urldisplay = document.getElementById('urldisplay');
const copybutton = document.getElementById('copybutton');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formdata = new FormData(form);

    try {
        const res = await fetch('/', {
            method: 'POST',
            body: formdata
        });

        if (res.ok) {
            const link = await res.text();
            urldisplay.innerHTML = window.location.href + link;
            copybutton.hidden = false;
        } else {
            urldisplay.innerHTML = 'Failed to create link';
        }
    }
    catch (err) {
        console.error(err);
    }
});

copybutton.addEventListener('click', event => {
    console.log('meow')
    console.log(urldisplay.innerHTML)
    navigator.clipboard.writeText(urldisplay.innerHTML);
});