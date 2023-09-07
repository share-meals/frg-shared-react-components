const extract = (text: string, regex: string): any => {
    const extraction = new RegExp(`${regex}(.*)`).exec(text);
    if(extraction === null){
	return {
	    payload: null,
	    remainder: text.trim()
	}
    }else{
	return {
	    payload: extraction.length === 3
		   ? extraction[1]
		   : null,
	    remainder: extraction.length === 3
		     ? extraction[2].trim()
		     : extraction[1].trim()
	};
    }
}

const daysRegex = '((?:[SMTWFuouehra]{2}[,-]?)*)';
const hoursRegex = '([012]?[0-9]:[0-6][0-9][AP]M(?:-[012]?[0-9]:[0-6][0-9][AP]M)?)';
const notesRegex = '"(.*)"';
const lineRegex = `(?:${daysRegex})? ?(?:${hoursRegex})? ?(?:${notesRegex})?`;
const linesRegex = `^(?:${lineRegex}\n?)+$`;

export const hoursIsValid = (text: string): boolean => {
    const regex = new RegExp(linesRegex);
    return regex.test(text);
};

export const hoursParseLine = (text: string): any => {
    const {payload: days, remainder: remainderDays} = extract(text, daysRegex);
    const {payload: hours, remainder: remainderHours} = extract(remainderDays, hoursRegex);
    const {payload: notes, remainder: remainderNotes} = extract(remainderHours, notesRegex);
    return {
	days,
	hours,
	notes
    };
}

export const hoursParse = (text: string): any => {
    return text.trim().split('\n').map(
	(t: string) => {
	    return hoursParseLine(t.trim());
    });
}
