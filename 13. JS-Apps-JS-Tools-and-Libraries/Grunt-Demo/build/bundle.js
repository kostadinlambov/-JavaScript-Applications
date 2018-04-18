var loggingModule = {
    greet: function (){
        console.log('Logging from module');
    }
}

(function () {
    document.write('<h1>Hello, Grunt!</h1>');
    loggingModule.greet();
})();
