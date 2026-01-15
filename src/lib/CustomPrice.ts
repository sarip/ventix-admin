import moment from "moment/moment";

const formatRupiah = (amount, useRp = true) => {
    const formattedAmount = new Intl.NumberFormat('id-ID').format(amount);
    return useRp ? `Rp. ${formattedAmount}` : formattedAmount;
};

export  {formatRupiah}