const formatPhone = (phone) => {
    if(!phone ||  typeof phone !== 'string')  throw new Error("missing phone number or incorrect format");
    const countryCode = phone.slice(0, 2);
    console.log('codigo pais', countryCode);
    const areaCode = phone.slice(3, 5);
    console.log('codigo de area', areaCode);
    const mainNumber = phone.slice(5);
    console.log('numero', mainNumber);

    return `+${countryCode} ${areaCode}-15-${mainNumber}`
    
}

module.exports = {formatPhone}