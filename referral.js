function generateReferralCode(userId){

    return "UKH" + String(userId).padStart(6,"0");

}

module.exports = {
    generateReferralCode
};
