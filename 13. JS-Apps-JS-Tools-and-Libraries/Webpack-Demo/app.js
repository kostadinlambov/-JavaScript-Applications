module.export = function () {
    let loggingModule = module.require('./module');
    document.write('<h1>Hello, Grunt!</h1>');
    loggingModule.greet();
};
