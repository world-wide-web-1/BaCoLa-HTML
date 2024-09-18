"use strict";
var returned = false;
var autoname = false
var constructorBackup = [];
var li = 0;
var ignore = false;
var functions = {};
var variables = {
    "variable": {
      "value": "Example varable",
      "locked": true,
      "constant": false
    },
    "version": {
      "value": "1.0 (BETA)",
      "locked": true,
      "constant": false
    },
    "stopOnError": {
      "value": true,
      "locked": true,
      "constant": false
    },
    "stopOnWarn": {
      "value": false,
      "locked": true,
      "constant": false
    },
    "executionLevel": {
      "value": 0,
      "locked": true,
      "constant": false,
      "_comment": "Levels 0-2 on script execution. !!ONLY CHANGE THIS VARIABLE IF YOU KNOW WHAT YOU ARE DOING!!"
    },
    "showVarCreation": {
      "value": false,
      "locked": true,
      "constant": false
    },
    "clearConsoleAtStart": {
      "value": false,
      "locked": true,
      "constant": false
    }
  };
var broken = false;
var skip = false;
var importedModules = [];

function appendVariables(list){
  Object.assign(variables, list)
  return null
}
let syntaxoptions = {
  paren: [{
    open: '(',
    close: ')'
  },
  {
    open: '[',
    close: ']'
  },
  {
    open: '{',
    close: '}'
  }],
  quoteSets: ['"',"'",'`'],
  whitespace: [' ','  ','	'],
  lineend: "\n",
  indents: '  '
};
let syntax = {
  paren: [{
    open: '(',
    close: ')'
  },
  {
    open: '[',
    close: ']'
  },
  {
    open: '{',
    close: '}'
  }],
  quoteSets: ['"',"'",'`'],
  whitespace: [' ','  ','	','	'],
  lineend: "\n",
  indents: '  '
};
appendVariables(
  /*{
    version: {
      value: null,
      locked: true
    },
    stopOnError: {
      value: true,
      locked: true
    },
    showVarCreation: {
      value: false,
      locked: true
    },
    keepLanguageDefiningCommands: {
      value: false,
      locked: true
    },
    clearConsoleAtStart: {
      value: false,
      locked: true
    }
  }*/
)
let constructors = [];
let m_constructors = [];
function newConstructor(fn,c) {
  constructors.push([fn, c]);
}

// Normal Print Function
newConstructor('none',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '\n',
    map: [],
    evalParams: []
});
newConstructor('native',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'native function $1 {$2}',
    map: [['1','name'],['2','code']],
    evalParams: []
});

newConstructor('name',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'name $1 {$2}',
    map: [['1','n'],['2','fns']],
    evalParams: []
});

newConstructor('is_imported',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'is_imported $1',
    map: [['1','name']],
    evalParams: []
});

newConstructor('unload',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'unload $1',
    map: [['1','name']],
    evalParams: []
});

newConstructor('and',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 and $2',
    map: [['1','a'],['2','b']],
    evalParams: ['a', 'b']
});

newConstructor('or',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 or $2',
    map: [['1','a'],['2','b']],
    evalParams: ['a', 'b']
});

newConstructor('xor',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 xor $2',
    map: [['1','a'],['2','b']],
    evalParams: ['a', 'b']
});

newConstructor('not',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'not $1',
    map: [['1','a'],['2','b']],
    evalParams: ['a']
});

newConstructor('constructor',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'constructor $1 ({$2},{$3},{$4})',
    map: [['1','name'],['2','constructor'],['3','map'],['4','evalParams']],
    evalParams: []
});

newConstructor('setlockedvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setlockedvar $1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["name", "value"]
});

newConstructor('setlockedvar2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setlockedvar $1 ||= $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["name", "value"]
});

newConstructor('getvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'getvar $1',
    map: [['1','name']],
    evalParams: []
});

newConstructor('setvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setvar $1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('constant',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'const $1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('setvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 = $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('setvar',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'module_path',
    map: [],
    evalParams: []
});

newConstructor('setvar2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 ||= $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('setvar2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'setvar $1 ||= $2.',
    map: [['1','name'], ['2', 'value']],
    evalParams: ["value"]
});

newConstructor('error',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'error = $1.',
    map: [['1', 'txt']],
    evalParams: ['txt']
});
newConstructor('warn',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'warn = $1.',
    map: [['1', 'txt']],
    evalParams: ['txt']
});

newConstructor('EvalJS',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'EvalJS {$1}',
    map: [['1','txt']],
    evalParams: []
});

newConstructor('javascript',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'javascript {$1}',
    map: [['1','txt']],
    evalParams: []
});

newConstructor('EvalJS2',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'EvalJS2 = $1',
    map: [['1','txt']],
    evalParams: ["txt"]
});

newConstructor('EvalFn',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'EvalFn = $1',
    map: [['1','txt']],
    evalParams: ["txt"]
});

newConstructor('import',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'import $1',
    map: [['1','n']],
    evalParams: ["n"]
});

newConstructor('executeFile',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'exec $1.',
    map: [['1','fn']],
    evalParams: ["fn"]
});

newConstructor('wait',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'wait $1.',
    map: [["1", "ms"]],
    evalParams: ["ms"]
});

newConstructor('input',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'input = $1.',
    map: [["1", "prompt"]],
    evalParams: ["prompt"]
});

newConstructor('if',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 ? $2 : $3',
    map: [['1', 'bool'],['2', 'then'],['3','else']],
    evalParams: ['bool', 'then', 'else']
});

newConstructor('if',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'if $1 then {$2} else $3',
    map: [['1', 'bool'],['2', 'then'],['3','else']],
    evalParams: ['bool']
});

newConstructor('ifne',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'if $1 then {$2}',
    map: [['1', 'bool'],['2', 'then']],
    evalParams: ['bool']
});

newConstructor('add',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 + $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('subtract',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 - $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('multiply',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 * $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('divide',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 / $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('add',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math add $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('subtract',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math subtract $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('multiply',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math multiply $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('divide',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'Math divide $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('greaterthan',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 > $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('lessthan',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 < $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('equalto',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 == $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('greaterthanequalto',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 >= $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('lessthanequalto',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 <= $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('joinStr',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '> $1 & $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('remainder',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 % $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('power',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '$1 ** $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('savedefvars',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'savedefvars.',
    map: [[]],
    evalParams: []
});

/*newConstructor('joinStr',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'join = $1 $2',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});*/


newConstructor('joinStr',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: '>($1, $2)<',
    map: [['1', 'x'],['2', 'y']],
    evalParams: ['x', 'y']
});

newConstructor('importJS',{
    paren: [{
      open: '(',
      close: ')'
    },
    {
      open: '[',
      close: ']'
    },
    {
      open: '{',
      close: '}'
    }],
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: 'importJS $1',
    map: [['1', 'source']],
    evalParams: ['1']
});

let fns = {
  codeBlock: (ARGS) => {
    let program = ARGS.code;
    let _l = compileLines(program,syntaxoptions);
    _l = compileLines(program,syntax);
    for(let [i, line] of _l.entries()) {
      readFunction(line, false, i);
    }
  },
  native: (ARGS) => {
    //console.log(ARGS.code.trim('\n').trim())
    //fns[ARGS.name] = Function("return "+ARGS.code.trim('\n').trim())();
    fns[ARGS.name] = eval("()=>{return "+ARGS.code.trim('\n').trim() + "}")();
  },
  and: (ARGS) => {
    return ARGS.a && ARGS.b;
  },
  or: (ARGS) => {
    return ARGS.a || ARGS.b;
  },
  javascript: (ARGS) => {
    return eval(ARGS.code);
  },
  status: (ARGS) => {
    variables.status = ARGS.bool;
  },
  not: (ARGS) => {
    return !ARGS.a;
  },
  xor: (ARGS) => {
    return (ARGS.a && !ARGS.b) || (!ARGS.a && ARGS.b);
  },
  constructor: (ARGS) => {
    newConstructor(ARGS.name,{
    paren: syntax.paren,
    quoteSets: ['"',"'",'`'],
    whitespace: [' ','  ','	','	'],
    c: ARGS.constructor,
    map: JSON.parse(ARGS.map),
    evalParams: JSON.parse(ARGS.evalParams)
    });
  },
  name: (ARGS) => {
    readFunction("error = \"This function is disabled.\"", 2, 0, false);
  },
  is_imported: (ARGS) => {
    return importedModules.find(e => e[0] === ARGS.name) ? true : false;
  },
  unload: (ARGS) => {
    readFunction("error = \"This function is disabled.\"", 2, 0, false);
  },
  printDBL: (ARGS) => {
    console.log(ARGS.label+": "+ARGS.content);
  },
  setlockedvar: (ARGS) => {
    if ((ARGS.name) in variables){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
    }else{
      variables[ARGS.name] = {
        value: ARGS.value,
        locked: true,
        constant: false
      };
      if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  setlockedvar2: (ARGS) => {
    if ((ARGS.name) in variables && fns[ARGS.name]()){
        return fns[ARGS.name]();
    }else{
      variables[ARGS.name] = {
        value: ARGS.value,
        locked: true,
        constant: false
      };
      if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  getvar: (ARGS) => {
    if ((ARGS.name) in variables){
      return variables[ARGS.name].value
    }else{
      if (!ignore){
        console.log("%s",`ExecutionError: Unknown variable`);
        if (variables.stopOnError.value){
          return;
        }
      }
    }
  },
  setvar: (ARGS) => {
    if (((ARGS.name) in variables)){
      if (!variables[ARGS.name].locked && !variables[ARGS.name].constant){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      }else if (variables[ARGS.name].locked){
        if (!ignore) {
          console.log("%s",`ExecutionError: Cannot write to a locked variable`);
          if (variables.stopOnError.value){
          return;
          }
        }
      }else if (variables[ARGS.name].constant){
        if (!ignore) {
          console.log("%s",`ExecutionError: Cannot write to a constant.`);
          if (variables.stopOnError.value){
          return;
          }
        }
      }
    }else{
     variables[ARGS.name] = {
        value: ARGS.value,
        locked: false,
        constant: false
      };
      if (!ARGS.name in fns){
        constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
      }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  constant: (ARGS) => {
    if (((ARGS.name) in variables)){
      if (!variables[ARGS.name].locked){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
        }
      }else{
        if (!ignore) {
          console.log("%s",`ExecutionError: Cannot write to a locked variable`);
          if (variables.stopOnError.value){
          return;
          }
        }
      }
    }else{
     variables[ARGS.name] = {
        value: ARGS.value,
        locked: false,
        constant: true
      };
      if (!ARGS.name in fns){
        constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
        fns[ARGS.name] = () => ARGS.value
      }
      if (variables.showVarCreation.value){
        console.log(`Created varable: ${ARGS.name}`);
      }
    }
  },
  setvar2: (ARGS) => {
    if (((ARGS.name) in variables) && fns[ARGS.name]()){
      return fns[ARGS.name]();
    }else{
     if (((ARGS.name) in variables)){
      if (!variables[ARGS.name].locked && !variables[ARGS.name].constant){
        variables[ARGS.name].value = ARGS.value;
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
          fns[ARGS.name] = () => ARGS.value
          }
        }else if (variables[ARGS.name].locked){
          if (!ignore) {
            console.log("%s",`ExecutionError: Cannot write to a locked variable`);
            if (variables.stopOnError.value){
            return;
            }
          }
        }else if (variables[ARGS.name].constant){
          if (!ignore) {
            console.log("%s",`ExecutionError: Cannot write to a constant.`);
            if (variables.stopOnError.value){
            return;
            }
          }
        }
      }else{
      variables[ARGS.name] = {
          value: ARGS.value,
          locked: false,
          constant: false
        };
        if (!ARGS.name in fns){
          constructors.push([ARGS.name, {paren:[{open:"(",close:")"},{open:"[",close:"]"},{open:"{",close:"}"}],quoteSets:['"',"'","`"],whitespace:[" ","  ","	","	"],c:ARGS.name,map:[],evalParams:[]}])
          fns[ARGS.name] = () => ARGS.value
        }
        if (variables.showVarCreation.value){
          console.log(`Created varable: ${ARGS.name}`);
        }
      }
    }
  },
  error: (ARGS) => {
    if (!ignore) {
      console.log("%s",`ExecutionError: ${ARGS.txt}`);
      if (variables.stopOnError.value){
        return;
      }
    }
  },
  warn: (ARGS) => {
    if (!ignore){
      console.log("\x1b[33;1m%s\x1b[0m",`ExecutionWarn: ${ARGS.txt}`);
      if (variables.stopOnWarn.value){
        return;
      }
    }
  },
  EvalJS: (ARGS) => {
    try{
      return eval(ARGS.txt.trim("\n").trim())
    }catch(err){
      if (!ignore) {
        console.log("%s",`ExecutionError: ${err}`);
        if (variables.stopOnError.value){
          return;
        }
      }
    }
  },
  EvalJS2: (ARGS) => {
    try{
      return eval(ARGS.txt)
    }catch(err){
      if (!ignore) {
        console.log("%s",`ExecutionError: ${err}`);
        if (variables.stopOnError.value){
          return;
        }
      }
    }
  },
  EvalFn: (ARGS) => {
    return readFunction(ARGS.txt)
  },
  import: async (ARGS) => {
    readFunction("error = \"This function is disabled, please load a module with the 'bacola_module' tag.\".", 2, 0, false);
  },
  executeFile: (ARGS) => {
    readFunction("error = \"This function is disabled.\"", 2, 0, false);
  },
  if: (ARGS) => {
    if (ARGS.bool) {
      let program = ARGS.then;
      let _l = compileLines(program,syntaxoptions);
      _l = compileLines(program,syntax);
      for(let [i, line] of _l.entries()) {
        readFunction(line, false, i);
      }
    } else {
      let program = ARGS.else;
      let _l = compileLines(program,syntaxoptions);
      _l = compileLines(program,syntax);
      for(let [i, line] of _l.entries()) {
        readFunction(line, false, i);
      }
    }
  },
  ifne: (ARGS) => {
    if (ARGS.bool) {
      let program = ARGS.then;
      let _l = compileLines(program,syntaxoptions);
      _l = compileLines(program,syntax);
      for(let [i, line] of _l.entries()) {
        readFunction(line, false, i);
      }
    }
  },
  wait: (ARGS) => {
    return new Promise(resolve => setTimeout(resolve, ARGS.ms));
  },
  add: (ARGS) => {
    if (typeof(ARGS.x) == "number" && typeof(ARGS.y) == "number"){
      return Number(ARGS.x) + Number(ARGS.y);
    } else {
      return String(ARGS.x) + String(ARGS.y)
    }
  },
  subtract: (ARGS) => {
    return Number(ARGS.x) - Number(ARGS.y);
  },
  multiply: (ARGS) => {
    return Number(ARGS.x) * Number(ARGS.y);
  },
  power: (ARGS) => {
    return Number(ARGS.x) ** Number(ARGS.y);
  },
  divide: (ARGS) => {
    return Number(ARGS.x) / Number(ARGS.y);
  },
  greaterthan: (ARGS) => {
    return Number(ARGS.x) > Number(ARGS.y)
  },
  lessthan: (ARGS) => {
    return Number(ARGS.x) < Number(ARGS.y)
  },
  equalto: (ARGS) => {
    return ARGS.x === ARGS.y
  },
  greaterthanequalto: (ARGS) => {
    return Number(ARGS.x) >= Number(ARGS.y)
  },
  lessthanequalto: (ARGS) => {
    return Number(ARGS.x) <= Number(ARGS.y)
  },
  joinStr: (ARGS) => {
    return (String(ARGS.x) + String(ARGS.y))
  },
  remainder: (ARGS) => {
    return Number(ARGS.x) % Number(ARGS.y)
  },
  savevars: (ARGS) => {
    readFunction("error = \"This function is disabled.\"", 2, 0, false);
  },
  savedefvars: (ARGS) => {
    readFunction("error = \"This function is disabled.\"", 2, 0, false);
  }
}
// Back to Actual Engine

variables.return = {
  locked: true,
  value: null
}
variables.args = {
  locked: true,
  value: {}
}

function allZero(arr) {
  for(let i in arr) {
    if(arr[i]!=0) {
      return false;
    }
  }
  return true;
}
//console.log(decodeParams('<@param1="a" @param2="b">', "param2", "param1"))
function decodeParams(paramstr, ...args) {
  //<@param1="a" @param2="b">
  var params_raw;
  if (paramstr.startsWith("<") && paramstr.endsWith(">")) {
    params_raw = paramstr.substring(1, paramstr.length-1);
  } else {
    throw "Invalid parameter syntax!"
  }
  var params = params_raw.split(" ");
  var params_return = [];
  for (var i = 0; i < params.length; i++){
    params[i] = params[i].split("=");
  }
  for (var j = 0; j < args.length; j++){
    for (var k = 0; k < params.length; k++){
      if (("@" + args[j]) == params[k][0]) {
        var str = params[k][1].match(/(['"])((\\\1|.)*?)\1/gm).join("");
        params_return[params_return.length] = str.substring(1, str.length-1)
      }
    }
  }
  return params_return;
}
//console.log(encodeParams({param1: "a", param2: "b"}))
function encodeParams(paramObject) {
  /*
    {
      param1: "a",
      param2: "b"
    }
  */
  var params_raw = "";
  for (const [key, value] of Object.entries(paramObject)) {
    params_raw += " @" + key + "=\"" + value.replaceAll("\\", "\\\\").replaceAll("\"", "\\\"") + "\"";
  }
  return "<" + params_raw.slice(1) + ">";
}

function splitFromConstructor(txt,c) {
  let p = [];
  for(let i in c.paren) {
    p.push(0);
  }
  let q = [];
  for(let i in c.quoteSets) {
    q.push(0);
  }
  let params = {};
  let j = 0;
  //if(!txt) {
    //console.log(txt);
    //throw Error(txt);
  //}
  for(let i=0; i<txt.length; i++) {
    if(txt[i] == c.c[j]) {
      j++;
    } else {
      if(c.c[j]=="$") {
        //i++;
        j+=2;
        params[c.c[j-1]] = ""
        while(!((txt[i]==c.c[j]||(i>txt.length-1))&&allZero(p)&&allZero(q))) {
          params[c.c[j-1]] += txt[i];
          if(allZero(q)) {
            for(let k in c.paren) {
              if(txt[i] == c.paren[k].open) {
                p[k] = p[k] + 1;
              }
              if(txt[i] == c.paren[k].close) {
                p[k] = p[k] - 1;
              }
            }
          }
          for(let k in c.quoteSets) {
            if(txt[i] == c.quoteSets[k]) {
              q[k] = 1 - q[k];
            }
          }
          if(i > txt.length+1) {
            //console.log(allZero(q),allZero(p));
            //throw Error("Past proper range; check that quotes and parentheses match.")
            if (!ignore) {
              console.log("%s",`ExecutionError: Past proper range; check that quotes and parentheses match.`);
              if (variables.stopOnError.value){
                return;
              }
            }
          }
          i++;
        }
        i--;
      } else {
        throw ("Incorrect constructor")
      }
    }
  } 
  return params;
}

function mapParam(map,param) {
  for(let jkl=0; jkl<map.length; jkl++) {
    if(map[jkl][0]==param) {
      return map[jkl][1];
    }
  }
  return '[UN-NAMED PARAMS]';
}

function readFunction(txt, lvl, ln) {
  var constructors_joined = constructors;
  for (var i = 0; i < importedModules.length; i++) {
    var arr = m_constructors[importedModules[i][0]];
    for (var j = 0; j < arr.length; j++) {
      constructors_joined.push(arr[j]);
    }
  }
  if (txt === "") {
    return "";
  }

  let curr = {};
  let fn = '';
  let map = [];
  let evalParams = false;

  for (let l = 0; l < constructors_joined.length; l++) {
    try {
      curr = splitFromConstructor(txt, constructors_joined[l][1]);
      fn = constructors_joined[l][0];
      if ((lvl === 0 && (fn === "name" || fn === "native" || fn === "constructor" || fn === "setlockedvar" || fn === "setlockedvar2" || fn === "savedefvars." || fn === "savedefvars" || fn == "javascript")) || (lvl === 1 && (fn === "setlockedvar" || fn === "setlockedvar2" || fn === "savedefvars." || fn === "savedefvars")) || (lvl === 2 && (false))) {
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (L${ln}): \n\n${txt}\n`);
          if (variables.stopOnError.value) {
            process.exit();
          }
        }
      }
      evalParams = constructors_joined[l][1].evalParams;
      map = constructors_joined[l][1].map;
    } catch(err) {
      if (err === 'Incorrect constructor') {
        continue;
      } else if (constructors_joined[l] === null || constructors[l] === undefined) {
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (L${ln}): \n\n${txt}\n`);
          if (variables.stopOnError.value) {
            process.exit();
          }
        }
      } else {
        if (!ignore) {
          console.log("\x1b[31m%s\x1b[0m", `ExecutionError: ${err} (L${ln}): \n\n${txt}\n`);
          if (variables.stopOnError.value) {
            process.exit();
          }
        }
      }
    }
  }

  let ncurr = {};

  for (let l in curr) {
    ncurr[mapParam(map, l)] = curr[l];
  }

  if (evalParams) {
    for (let l of evalParams) {
      ncurr[l] = readFunction(ncurr[l]);
    }
  }

  if (fn !== '' && fn !== "input") {
    try {
      var data = fns[fn](ncurr);
      return data;
    } catch(err) {
      if (!ignore) {
        console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (L${ln}): \n\n${txt}\n`);
        if (variables.stopOnError.value) {
          process.exit();
        }
      }
    }
  } else if (fn === "input") {
    return prompt(ncurr.prompt);
  } else {
    if (!ignore) {
      console.log("\x1b[31m%s\x1b[0m", `ExecutionError: Function does not exist (CODE-BLOCK_ID::${ln}): \n\n\x1b[1m\x1b[31m${txt}\n`);
      if (variables.stopOnError.value) {
        process.exit();
      }
    }
  }
}


function compileLines(txt,c) {
  let code;
  if(c.indents) {
  let stuff = txt.split('\n');
  let indentLevel = 0;
  for(let jkl in stuff) {
    for(let counter = 0; counter<indentLevel; counter++) {
      if(stuff[jkl].search(c.indents)==-1) {
        indentLevel = counter;
        //stuff[jkl] = "}" + stuff[jkl];
        stuff[jkl-1] += "\n}"
      } else {
        stuff[jkl] = stuff[jkl].replace(c.indents,'');
      }
    }
    if(stuff[jkl].search(c.indents)!=-1) {
      indentLevel++;
      stuff[jkl] = stuff[jkl].replace(c.indents,"");
      stuff[jkl-1] += " {"
    }
  }
  code = stuff.join('\n');
  //console.log(code);
  } else {
  code = txt;
  }

  let lines = [''];
  let p = [];
  for(let i in c.paren) {
    p.push(0);
  }
  let q = [];
  for(let i in c.quoteSets) {
    q.push(0);
  }
  for(let j=0; j<code.length; j++) {
    lines[lines.length-1] += code[j];
  if(allZero(q)) {
    for(let k in c.paren) {
      if(code[j] == c.paren[k].open) {
        p[k] = p[k] + 1;
      }
      if(code[j] == c.paren[k].close) {
        p[k] = p[k] - 1;
      }
    }
  }
  for(let k in c.quoteSets) {
    if(code[j] == c.quoteSets[k]) {
      q[k] = 1 - q[k];
    }
  }
  if(allZero(q)&&allZero(p)&&code[j]==c.lineend) {
    lines.push('');
  }

  }
  lines = lines.map(n=>{
    let z = n;
    for(let xyz in c.whitespace) {
    while(z.search(c.whitespace[xyz])==0) {
      z = z.trim(c.whitespace[xyz]);
    }
    }
    z = z.trim("\n");
    return z;
  });
  return lines;


}

async function executeBaCoLa(src, level) {
  /*try*/ if(1) {
    var data = await fetch(src);
    var program = await data.text();
    _l = compileLines(program, syntax);

    for (let [i, line] of _l.entries()) {
      await readFunction(line, level ? level : 0, i + 1);
    }
  }/* catch (err) {
    if (!ignore) {
      console.error("%s", `ExecutionError: ${err}`);
      if (variables.stopOnError.value) {
        return;
      }
    }
  }*/
}

var init = async () => {
  try {
    var data = await fetch("https://raw.githubusercontent.com/world-wide-web-1/BaCoLa-HTML/refs/heads/main/language");
    var program = await data.text();
    let _l = compileLines(program, syntaxoptions);
    for (let [i, line] of _l.entries()) {
      await readFunction(line, 2, i + 1);
    }
  } catch (err) {
    if (!ignore) {
      console.error("%s", `ExecutionError: ${err}`);
      if (variables.stopOnError.value) {
        return;
      }
    }
  }
};

init();

const processBacolaScript = async (script) => {
  const program = script.hasAttribute('src') ? await fetchContent(script.getAttribute('src')) : script.innerText;
  const lines = compileLines(program, syntaxoptions);
  for (let [i, line] of lines.entries()) await readFunction(line, variables.executionLevel.value, i + 1);
};

const processBacolaModule = async (module) => {
  const program = module.hasAttribute('src') ? await fetchContent(module.getAttribute('src')) : module.innerText;
  const lines = compileLines(program, syntax);
  for (let [i, line] of lines.entries()) await readFunction(line, 1, i + 1);
};

const fetchContent = async (src) => {
  const response = await fetch(src);
  return await response.text();
};

const processScriptElement = (element) => {
  if (element.tagName === 'SCRIPT' && element.type === 'text/bacola-script') {
    if (element.hasAttribute('defer')) {
      document.addEventListener('DOMContentLoaded', () => {
        if (element.src) element.addEventListener('load', () => processBacolaScript(element));
        else processBacolaScript(element);
      });
    } else {
      if (element.src) element.addEventListener('load', () => processBacolaScript(element));
      else processBacolaScript(element);
    }
  } else if (element.tagName === 'SCRIPT' && element.type === 'text/bacola-module') {
    if (element.hasAttribute('defer')) {
      document.addEventListener('DOMContentLoaded', () => {
        if (element.src) element.addEventListener('load', () => processBacolaModule(element));
        else processBacolaModule(element);
      });
    } else {
      if (element.src) element.addEventListener('load', () => processBacolaModule(element));
      else processBacolaModule(element);
    }
  }
};

const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        processScriptElement(node);
        if (node.querySelectorAll) {
          node.querySelectorAll('script[type="text/bacola"], script[type="text/bacola-module"]').forEach(processScriptElement);
        }
      }
    });
  });
});

observer.observe(document, { childList: true, subtree: true });
