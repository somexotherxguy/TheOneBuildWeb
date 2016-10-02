
(function() {

    //Event Handlers
    document.getElementById('champsearchform').addEventListener('submit', function(event) { on_search(event); });

    function on_search(e){
        window.localStorage.setItem('champname', document.getElementById('champsearch').value);
        window.location.href = 'build.html';
        event.preventDefault();
    }
})();
