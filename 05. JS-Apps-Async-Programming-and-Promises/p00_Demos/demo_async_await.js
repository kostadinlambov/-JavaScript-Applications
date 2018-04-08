async function test() {
    console.log('Start')
    await new Promise(function (resolve, reject) {
        setTimeout(function () {
            resolve('Success')
        }, 1000)
    }).then(function (res) {
        console.log(res)
    })
    console.log('End')
    return 'Test'
}
test().then(function (res) {
    console.log(res)
}).catch(function (err){
    console.log(err)
});