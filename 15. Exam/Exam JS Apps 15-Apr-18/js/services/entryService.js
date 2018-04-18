let entryService = (() => {
    function getEntriesByReceiptId(receiptId) {
        const endpoint = `entries?query={"receiptId":"${receiptId}"}`;
        return remote.get('appdata', endpoint, 'kinvey');
    }

    function addEntry(type, qty, price, receiptId) {
        let data = {type, qty, price, receiptId};
        return remote.post('appdata', 'entries', 'kinvey', data);
    }

    function deleteEntry(entryId) {

        return remote.remove('appdata', 'entries/' + entryId, 'kinvey')
    }

    return {
        getEntriesByReceiptId,
        addEntry,
        deleteEntry,
    }

})();