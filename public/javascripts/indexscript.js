$(document).ready(function () {
    var terminal = $('#terminal').terminal(function (cmd, term) {
        if (cmd){
            
        }
    }, {
        greetings: 'bu bizim botumuz',
        name: 'raspbot',
        height: 400,
        prompt: '--> '
    });
});

