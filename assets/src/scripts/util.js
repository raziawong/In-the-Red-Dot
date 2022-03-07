const UTIL = {
    compareAsc: (a, b) => b - a,
    compareDesc: (a, b) => a - b,
    compareAlphaNumAsc: (a, b) => a.localeCompare(b, undefined, { numeric: true }),
    compareAlphaNumDesc: (a, b) => b.localeCompare(a, undefined, { numeric: true }),
    convertDOSKeys: str => str.trim().toLowerCase().replaceAll(/\s+/g, ' ').replaceAll(' ', '_'),
    getNum: v => isNaN(v) ? null : Number(v),
    getPercent: (v, t) => Math.round((v / t) * 100),
    getTitleCase: str => str.trim().toLowerCase().split(' ').map(w => w.charAt(0).toUpperCase() + w.substring(1)).join(' '),
    getKeyByValue: (object, value) => Object.keys(object).find(key => object[key] === value),
    viewPortSize: () => window.innerWidth ? {
        width: window.innerWidth,
        height: window.innerHeight
    } : {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    },
    dwellToggleLabel: n => {
        return n == GD_DATA_KEYS.HDB_DWELL ? CHART_LABELS.HDB :
            n == GD_DATA_KEYS.CONDO_OTH ? CHART_LABELS.CONDO :
            n == GD_DATA_KEYS.LANDED_PROP ? CHART_LABELS.LANDED :
            n == GD_DATA_KEYS.OTHERS ? CHART_LABELS.OTHERS :
            false;
    },
    eduToggleLabel: n => {
        return n == GD_DATA_KEYS.UNIVERSITY ? CHART_LABELS.UNIVERSITY :
            n == GD_DATA_KEYS.PROFESSIONAL ? CHART_LABELS.PROFESSIONAL :
            n == GD_DATA_KEYS.POLYTECHNIC ? CHART_LABELS.POLYTECHNIC :
            n == GD_DATA_KEYS.POST_SEC ? CHART_LABELS.POST_SEC :
            n == GD_DATA_KEYS.SECONDARY ? CHART_LABELS.SECONDARY :
            n == GD_DATA_KEYS.LOW_SEC ? CHART_LABELS.LOW_SEC :
            n == GD_DATA_KEYS.PRIMARY ? CHART_LABELS.PRIMARY :
            n == GD_DATA_KEYS.NO_QUALIFICATION ? CHART_LABELS.NONE :
            false;
    },
    litToggleLabel: n => {
        return n == GD_DATA_KEYS.NOT_LIT ? CHART_LABELS.NOT_LIT :
            n == GD_DATA_KEYS.ONE_LANG ? CHART_LABELS.LIT_ONE :
            n == GD_DATA_KEYS.TWO_LANG ? CHART_LABELS.LIT_TWO :
            n == GD_DATA_KEYS.THREE_LANG ? CHART_LABELS.LIT_THREE :
            false;
    },
    incomeToggleLabel: (n, isString = false) => {
        let ret = "";
        if (isString) {
            ret = n == GD_DATA_KEYS.BELOW_1K ? 999 :
                n == GD_DATA_KEYS.BELOW_2K ? 1999 :
                n == GD_DATA_KEYS.BELOW_3K ? 2999 :
                n == GD_DATA_KEYS.BELOW_4K ? 3999 :
                n == GD_DATA_KEYS.BELOW_5K ? 4999 :
                n == GD_DATA_KEYS.BELOW_6K ? 5999 :
                n == GD_DATA_KEYS.BELOW_7K ? 6999 :
                n == GD_DATA_KEYS.BELOW_8K ? 7999 :
                n == GD_DATA_KEYS.BELOW_9K ? 8999 :
                n == GD_DATA_KEYS.BELOW_10K ? 9999 :
                n == GD_DATA_KEYS.BELOW_11K ? 10999 :
                n == GD_DATA_KEYS.BELOW_12K ? 11999 :
                n == GD_DATA_KEYS.BELOW_15K ? 14999 :
                n == GD_DATA_KEYS.OVER_15K ? 15000 :
                false;
        } else {
            ret = n == 999 ? GD_DATA_KEYS.BELOW_1K :
                n == 1999 ? GD_DATA_KEYS.BELOW_2K :
                n == 2999 ? GD_DATA_KEYS.BELOW_3K :
                n == 3999 ? GD_DATA_KEYS.BELOW_4K :
                n == 4999 ? GD_DATA_KEYS.BELOW_5K :
                n == 5999 ? GD_DATA_KEYS.BELOW_6K :
                n == 6999 ? GD_DATA_KEYS.BELOW_7K :
                n == 7999 ? GD_DATA_KEYS.BELOW_8K :
                n == 8999 ? GD_DATA_KEYS.BELOW_9K :
                n == 9999 ? GD_DATA_KEYS.BELOW_10K :
                n == 10999 ? GD_DATA_KEYS.BELOW_11K :
                n == 11999 ? GD_DATA_KEYS.BELOW_12K :
                n == 14999 ? GD_DATA_KEYS.BELOW_15K :
                n == 15000 ? GD_DATA_KEYS.OVER_15K :
                false;
        }
        return ret;
    },
    jobsToggleLabel: n => {
        return n == GD_DATA_KEYS.ASC_PROF_TECH ? CHART_LABELS.ASC_PROF_TECH :
            n == GD_DATA_KEYS.LABOUR_WORKERS ? CHART_LABELS.LABOUR_WORKERS :
            n == GD_DATA_KEYS.CLERICAL_WORLKERS ? CHART_LABELS.CLERICAL_WORLKERS :
            n == GD_DATA_KEYS.TRADE_WORKERS ? CHART_LABELS.TRADE_WORKERS :
            n == GD_DATA_KEYS.LEGISLATORS_MANAGERS ? CHART_LABELS.LEGISLATORS_MANAGERS :
            n == GD_DATA_KEYS.MACHINE_OPERATORS ? CHART_LABELS.MACHINE_OPERATORS :
            n == GD_DATA_KEYS.OTHERS_1 ? CHART_LABELS.OTHERS :
            false
    },
    transportToggleLabel: n => {
        return n == GD_DATA_KEYS.CAR ? CHART_LABELS.CAR :
            n == GD_DATA_KEYS.LORRY_PICKUP ? CHART_LABELS.LORRY :
            n == GD_DATA_KEYS.MRT_LRT_BUS ? CHART_LABELS.TRAIN_BUS :
            n == GD_DATA_KEYS.MRT_LRT ? CHART_LABELS.TRAIN :
            n == GD_DATA_KEYS.MOTORCYCLE_SCOOTER ? CHART_LABELS.MOTORCYCLE :
            n == GD_DATA_KEYS.OTHER_MRT_LRT_BUS ? CHART_LABELS.TRAIN_BUS_OTHERS :
            n == GD_DATA_KEYS.PRIVATE_BUS_VAN ? CHART_LABELS.PRIVATE_BUS :
            n == GD_DATA_KEYS.PUBLIC_BUS ? CHART_LABELS.PUBLIC_BUS :
            n == GD_DATA_KEYS.PRIVATE_HIRE_CAR ? CHART_LABELS.PRIVATE_HIRE_CAR :
            n == GD_DATA_KEYS.NO_TRANSPORT_REQ ? CHART_LABELS.NO_TRANSPORT_REQ :
            false
    },
    travelToggleLabel: (n) => {
        return n == GD_DATA_KEYS.MINS_15 ? CHART_LABELS.MINS_15 :
            n == GD_DATA_KEYS.MINS_30 ? CHART_LABELS.MINS_30 :
            n == GD_DATA_KEYS.MINS_45 ? CHART_LABELS.MINS_45 :
            n == GD_DATA_KEYS.MINS_60 ? CHART_LABELS.MINS_60 :
            n == GD_DATA_KEYS.MINS_OVER_60 ? CHART_LABELS.MINS_OVER_60 :
            false;
    }
};