interface Icon {
  link: string,
  width: number,
  height: number,
}

interface Stat {
  name: string,
  value: number,
  icon: Icon,
}

const stats : Stat[] = [
  { 
    name: 'Community Volunteers', 
    value: 500, 
    icon: { 
      link: '/stat/people.svg', 
      width: 75, 
      height: 59, 
    }, 
  },
  { 
    name: 'Events Organized', 
    value: 30, 
    icon: { 
      link: '/stat/calendar.svg', 
      width: 55, 
      height: 65.39,
    }, 
  },
  { 
    name: 'Community Reached', 
    value: 100, 
    icon: { 
      link: '/stat/map.svg', 
      width: 66, 
      height: 63.83 ,
    }, 
  },
  { 
    name: 'Industry Partners', 
    value: 20, 
    icon: { 
      link: '/stat/shake-hands.svg', 
      width: 102.73, 
      height: 65.39,
    }, 
  },
]

export { stats }