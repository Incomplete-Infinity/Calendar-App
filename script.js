document.querySelectorAll('.event').forEach(day => {
    day.addEventListener('mouseover', function () {
        let popup = document.getElementById('eventPopup');
        popup.style.display = 'block';
        popup.textContent = this.dataset.event;
        popup.style.left = `${this.getBoundingClientRect().left}px`;
        popup.style.top = `${this.getBoundingClientRect().top - 30}px`;
    });

    day.addEventListener('mouseout', function () {
        document.getElementById('eventPopup').style.display = 'none';
    });
});
