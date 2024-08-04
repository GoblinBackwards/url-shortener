const form = document.getElementById('form');
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
            const link = await res.text()
            alert(`Link created: ${link}`)
        } else {
            alert('Failed to create link')
        }
    }
    catch (err) {
        console.error(err);
    }

});