let receiptService = (() => {
    function getActiveReceipt(userId) {
        const endpoint = `receipts?query={"_acl.creator":"${userId}","active": "true" }`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    // function getReceiptByUserId(userId) {
    //     const endpoint = `receipts?query={"_acl.creator":"${userId}"}`;
    //
    //     return remote.get('appdata', endpoint, 'kinvey');
    // }

    function createReceipt() {
        let active = "true";
        let productCount = 0;
        let total = 0;
        let data = {active, productCount, total};
        return remote.post('appdata', 'receipts', 'kinvey',  data)
    }
    
    function getMyReceipts(userId) {

        const endpoint = `receipts?query={"_acl.creator":"${userId}","active":"false"}`;

        return remote.get('appdata', endpoint, 'kinvey');
    }

    function receiptDetails(receiptId) {
        const endpoint = `receipts/${receiptId}`;
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function commitReceipt(productCount,total,receiptId) {
        let active = "false";
        let data = {active, productCount, total};
        return remote.update('appdata', 'receipts/' +receiptId, 'kinvey',  data)
    }

    return {
        getActiveReceipt,
        createReceipt,
        getMyReceipts,
        receiptDetails,
        commitReceipt
    }

})();