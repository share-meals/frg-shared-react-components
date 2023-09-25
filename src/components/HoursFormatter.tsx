import merge from 'deepmerge';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import advanced from 'dayjs/plugin/advancedFormat';

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(advanced);

const daysRegex = /^[1-7]+$/;
const timeRegex = /[0]?[0-9]:[0-6][0-9]/;
const notesRegex = '"(.*)"';

export interface IHours {
    days: string | null,
    time_start: string | null,
    time_end: string | null,
    notes: string | null,
    time_zone: string | null
}

export const isValid = ({
    days,
    time_start,
    time_end,
    notes,
    time_zone
}: IHours): boolean => {
    const start = dayjs(time_start, 'H:mm');
    const end = dayjs(time_end, 'H:mm');
    return ((days !== null && daysRegex.test(days)) || days === null)
	&& (start.isValid() || time_start === null)
	&& (end.isValid() || time_end === null)
	&& !(time_start === null && time_end !== null)
	&& (start.isBefore(end) || time_start == null || time_end == null);
};

export interface IDictionary {
    [key: string]: string
    /*
    and?: string,
    comma?: string,
    lastComma?: string,
    1?: string,
    2?: string,
    3?: string,
    4?: string,
    5?: string,
    6?: string,
    7?: string
    */
}

const defaultDictionary = {
    and: ' and ',
    comma: ', ',
    lastComma: ', and ',
    1: 'Mo',
    2: 'Tu',
    3: 'We',
    4: 'Th',
    5: 'Fr',
    6: 'Sa',
    7: 'Su'
};

export const formatDays = ({
    days,
    dictionary = {}
}: {
    days: string,
    dictionary?: IDictionary
}): string => {
    const mergedDictionary: IDictionary = merge(defaultDictionary, dictionary);
    if(!daysRegex.test(days)){
	return '';
    }
    if(days.length === 1){
	return mergedDictionary[days];
    }
    if(days.length === 2){
	return `${mergedDictionary[days[0]]}${mergedDictionary.and}${mergedDictionary[days[1]]}`;
    }
    let tempDays = days.split('').map((s) => mergedDictionary[s]);
    tempDays[tempDays.length-2] = `${tempDays[tempDays.length-2]}${mergedDictionary.lastComma}${tempDays[tempDays.length-1]}`;
    tempDays.pop();
    return tempDays.join(mergedDictionary.comma);
}

interface IFormatHour {
    time: string,
    time_zone: string,
    time_zone_display?: string,
    format: string
}

export const formatHour = ({
    time,
    time_zone,
    time_zone_display,
    format
}: IFormatHour): string => {
    const t = dayjs(`${time} ${time_zone}`, 'H:mm z');
    if(!t.isValid()){
	throw new Error('invalid date');
    }else{
	return t.tz(time_zone_display || time_zone).format(format);
    }
}


/*
interface IFormatHours {
    separator?: string,
    time_start: string,
    time_start_format: string,
    time_end?: string | null,
    time_end_format?: string,
    time_zone: string,
    time_zone_display?: string
}

export const formatHours = ({
    separator = ' - ',
    time_start,
    time_start_format,
    time_end,
    time_end_format,
    time_zone,
    time_zone_display
}: IFormatHours): string => {
    try{
	const start = formatHour({
	    time: time_start,
	    time_zone,
	    time_zone_display: time_zone_display || time_zone,
	    format: time_start_format
	});
	const end = formatHour({
	    time: time_end,
	    time_zone,
	    time_zone_display: time_zone_display || time_zone,
	    format: time_end_format
	});
	return `${start}${separator}${end}`;
    }catch(error){
	return '';
    }
}
*/

/*
export const format = (
    hours: IHours,
    dictionary: any = {},
): any => {
    const mergedDictionary = merge(defaultDictionary, dictionary);
    const daysString = formatDays({days: hours.days, dictionary: mergedDictionary});
    const hoursString = formatHours({time_start: hours.time_start, time_end: hours.time_end, time_zone: hours.time_zone});
    return ;
}
*/
