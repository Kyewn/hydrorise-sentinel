import {inputAnatomy, menuAnatomy, tableAnatomy} from '@chakra-ui/anatomy';
import {
	createMultiStyleConfigHelpers,
	defineStyleConfig,
	extendTheme,
	theme
} from '@chakra-ui/react';

const Button = defineStyleConfig({
	baseStyle: {
		maxWidth: '200px',
		span: {
			overflow: 'hidden',
			textOverflow: 'ellipsis'
		}
	},
	variants: {
		solid: {
			backgroundColor: 'asBlue.800',
			color: 'white',
			minWidth: '100px',
			_hover: {
				borderColor: 'asBlue.300',
				backgroundColor: 'asBlue.300',
				_disabled: {
					opacity: 0.4,
					backgroundColor: 'asBlue.800'
				}
			},
			_focus: {
				outline: 'none'
			},
			_disabled: {
				opacity: 0.4,
				backgroundColor: 'asBlue.800'
			}
		},
		secondary: {
			backgroundColor: 'none',
			color: 'asBlue.800',
			border: '2px solid',
			borderColor: 'asBlue.800',
			_hover: {
				color: 'asBlue.700',
				borderColor: 'asBlue.200',
				backgroundColor: 'asBlue.200'
			},
			_active: {
				borderColor: 'asBlue.100',
				backgroundColor: 'asBlue.100'
			},
			_focus: {
				outline: 'none'
			}
		},
		outline: {
			border: '2px solid'
		},
		tableHeader: {
			background: 'none',
			fontSize: 'sm',
			fontFamily: theme.fonts.heading,
			textTransform: 'uppercase',
			_hover: {
				borderColor: 'asBlue.300',
				backgroundColor: 'asBlue.300',
				_disabled: {
					opacity: 0.4,
					backgroundColor: 'asBlue.800'
				}
			},
			_focus: {
				outline: 'none'
			},
			_disabled: {
				opacity: 0.4,
				backgroundColor: 'asBlue.800'
			}
		}
	}
});

const Input = createMultiStyleConfigHelpers(inputAnatomy.keys).defineMultiStyleConfig({
	variants: {
		filled: {
			field: {
				border: '2px solid',
				borderColor: 'asGrey.100',
				backgroundColor: 'white',
				_hover: {
					backgroundColor: 'asGrey.200'
				},
				_focus: {
					border: '2px solid',
					borderColor: 'asBlue.800',
					backgroundColor: 'white'
				}
			}
		}
	},
	defaultProps: {
		variant: 'filled'
	}
});

const Table = createMultiStyleConfigHelpers(tableAnatomy.keys).defineMultiStyleConfig({
	variants: {
		simple: {
			tr: {
				borderBottom: '2px solid',
				borderColor: 'asGrey.100',
				':not(:has(th)):not(.tr-no-data)': {
					_hover: {
						cursor: 'pointer',
						backgroundColor: 'asBlue.100'
					}
				},
				':has(th)': {
					backgroundColor: 'asBlue.400'
				}
			},
			th: {
				color: 'white',
				maxWidth: '400px'
			},
			td: {
				maxWidth: '400px',
				overflow: 'hidden',
				textOverflow: 'ellipsis'
			}
		}
	}
});

const Menu = createMultiStyleConfigHelpers(menuAnatomy.keys).defineMultiStyleConfig({
	baseStyle: {
		list: {
			maxHeight: '50vh',
			overflowY: 'auto'
		}
	}
});

// Ascending value = lighter -> darker
// Semantic tokens switch between color modes, default light mode
export const themes = extendTheme({
	semanticTokens: {
		colors: {
			asBlue: {
				100: {
					default: '#E9F7FA',
					_dark: '#008DAA'
				},
				200: {
					default: '#CDEBF3',
					_dark: '#005C7B'
				},
				300: {
					default: '#A2D0DD',
					_dark: '#74AEC4'
				},
				400: {
					default: '#4E93B2',
					_dark: '#74AEC4'
				},
				500: {
					default: '#74AEC4',
					_dark: '#4E93B2'
				},
				600: {
					default: '#005C7B',
					_dark: '#A2D0DD'
				},
				700: {
					default: '#008DAA',
					_dark: '#CDEBF3'
				},
				800: {
					default: '#06BAC5',
					_dark: '#005C7B'
				}
			},
			asGrey: {
				100: '#D9D9D9',
				200: '#EEEEED',
				300: '#D4D0C8'
			}
		}
	},
	components: {
		Button,
		Input,
		Table,
		Menu
	}
});
