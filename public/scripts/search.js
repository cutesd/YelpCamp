$('#campground-search').on('input', function() {
    var search = $(this).serialize();
    if (search === "search=") {
        search = "all";
    }
    $.get('/campgrounds?' + search, function(data) {
        $('#campground-grid').html('');
        data.forEach(function(camp) {
            $('#campground-grid').append(`
            <div class="col-md-3 col-sm-6"> 
                <div class="thumbnail"> 
                    <img src="${ camp.image }"> 
                    <div class="caption"> 
                        <h4>${ camp.name }</h4> 
                    </div> 
                    <p> <a href="/campgrounds/${ camp._id }" class="btn btn-primary">More Info</a> 
                    </p> 
                </div> 
            </div>
            `);
        });
    });
});

$('#campground-search').submit(function(e) {
    e.preventDefault();
})
