export class StateUtil {
  private static readonly states = [
    {
      abbr: 'AL',
      name: 'Alabama',
    },
    {
      abbr: 'AK',
      name: 'Alaska',
    },
    {
      abbr: 'AZ',
      name: 'Arizona',
    },
    {
      abbr: 'AR',
      name: 'Arkansas',
    },
    {
      abbr: 'CA',
      name: 'California',
    },
    {
      abbr: 'CO',
      name: 'Colorado',
    },
    {
      abbr: 'CT',
      name: 'Connecticut',
    },
    {
      abbr: 'DE',
      name: 'Delaware',
    },
    {
      abbr: 'DC',
      name: 'District Of Columbia',
    },
    {
      abbr: 'FL',
      name: 'Florida',
    },
    {
      abbr: 'GA',
      name: 'Georgia',
    },
    {
      abbr: 'GU',
      name: 'Guam',
    },
    {
      abbr: 'HI',
      name: 'Hawaii',
    },
    {
      abbr: 'ID',
      name: 'Idaho',
    },
    {
      abbr: 'IL',
      name: 'Illinois',
    },
    {
      abbr: 'IN',
      name: 'Indiana',
    },
    {
      abbr: 'IA',
      name: 'Iowa',
    },
    {
      abbr: 'KS',
      name: 'Kansas',
    },
    {
      abbr: 'KY',
      name: 'Kentucky',
    },
    {
      abbr: 'LA',
      name: 'Louisiana',
    },
    {
      abbr: 'ME',
      name: 'Maine',
    },
    {
      abbr: 'MH',
      name: 'Marshall Islands',
    },
    {
      abbr: 'MD',
      name: 'Maryland',
    },
    {
      abbr: 'MA',
      name: 'Massachusetts',
    },
    {
      abbr: 'MI',
      name: 'Michigan',
    },
    {
      abbr: 'MN',
      name: 'Minnesota',
    },
    {
      abbr: 'MS',
      name: 'Mississippi',
    },
    {
      abbr: 'MO',
      name: 'Missouri',
    },
    {
      abbr: 'MT',
      name: 'Montana',
    },
    {
      abbr: 'NE',
      name: 'Nebraska',
    },
    {
      abbr: 'NV',
      name: 'Nevada',
    },
    {
      abbr: 'NH',
      name: 'New Hampshire',
    },
    {
      abbr: 'NJ',
      name: 'New Jersey',
    },
    {
      abbr: 'NM',
      name: 'New Mexico',
    },
    {
      abbr: 'NY',
      name: 'New York',
    },
    {
      abbr: 'NC',
      name: 'North Carolina',
    },
    {
      abbr: 'ND',
      name: 'North Dakota',
    },
    {
      abbr: 'MP',
      name: 'Northern Mariana Islands',
    },
    {
      abbr: 'OH',
      name: 'Ohio',
    },
    {
      abbr: 'OK',
      name: 'Oklahoma',
    },
    {
      abbr: 'OR',
      name: 'Oregon',
    },
    {
      abbr: 'PW',
      name: 'Palau',
    },
    {
      abbr: 'PA',
      name: 'Pennsylvania',
    },
    {
      abbr: 'PR',
      name: 'Puerto Rico',
    },
    {
      abbr: 'RI',
      name: 'Rhode Island',
    },
    {
      abbr: 'SC',
      name: 'South Carolina',
    },
    {
      abbr: 'SD',
      name: 'South Dakota',
    },
    {
      abbr: 'TN',
      name: 'Tennessee',
    },
    {
      abbr: 'TX',
      name: 'Texas',
    },
    {
      abbr: 'UT',
      name: 'Utah',
    },
    {
      abbr: 'VT',
      name: 'Vermont',
    },
    {
      abbr: 'VI',
      name: 'Virgin Islands',
    },
    {
      abbr: 'VA',
      name: 'Virginia',
    },
    {
      abbr: 'WA',
      name: 'Washington',
    },
    {
      abbr: 'WV',
      name: 'West Virginia',
    },
    {
      abbr: 'WI',
      name: 'Wisconsin',
    },
    {
      abbr: 'WY',
      name: 'Wyoming',
    },
  ];

  /**
   * Returns the full name if given an abbreviation, returning the original string in all other cases.
   */
  static getFullName(abbr: string) {
    const state: { abbr: string, name: string } = this.states.find((s) => s.abbr === abbr);
    return state ? state.name : abbr;
  }

  /**
   * Returns the abbreviation if given a full name, returning the original string in all other cases.
   */
  static getAbbreviation(name: string) {
    const state: { abbr: string, name: string } = this.states.find((s) => s.name === name);
    return state ? state.abbr : name;
  }

  /**
   * Given a state abbreviation or full name, returns the other if it exists, null otherwise
   */
  static getStateNameOrAbbreviation(nameOrAbbreviation: string): string {
    const state: { abbr: string, name: string } = this.states.find((s) =>
      s.abbr === nameOrAbbreviation || s.name === nameOrAbbreviation);
    if (state.abbr === nameOrAbbreviation) {
      return state.name;
    } else if (state.name === nameOrAbbreviation) {
      return state.abbr;
    }
    return null;
  }

  /**
   * Returns a lucene search string that can be used to find the state by full name or abbreviation
   */
  static getStateSearchString(nameOrAbbreviation: string) {
    let searchString = `address.state:${nameOrAbbreviation}`;
    const other: string = this.getStateNameOrAbbreviation(nameOrAbbreviation);
    if (other) {
      searchString = `(address.state:${other} OR ${searchString})`;
    }
    return searchString;
  }
}
