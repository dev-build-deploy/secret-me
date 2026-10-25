import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
/******/ var __webpack_modules__ = ({

/***/ 482:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var __webpack_unused_export__;

/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
__webpack_unused_export__ = ({ value: true });
exports.jO = exports.Q7 = exports.NL = exports.KF = exports.tG = void 0;
var log_1 = __nccwpck_require__(578);
Object.defineProperty(exports, "tG", ({ enumerable: true, get: function () { return log_1.Log; } }));
var run_1 = __nccwpck_require__(85);
Object.defineProperty(exports, "KF", ({ enumerable: true, get: function () { return run_1.Run; } }));
var tool_1 = __nccwpck_require__(228);
Object.defineProperty(exports, "NL", ({ enumerable: true, get: function () { return tool_1.Tool; } }));
var result_1 = __nccwpck_require__(955);
Object.defineProperty(exports, "Q7", ({ enumerable: true, get: function () { return result_1.Result; } }));
var rule_1 = __nccwpck_require__(64);
Object.defineProperty(exports, "jO", ({ enumerable: true, get: function () { return rule_1.Rule; } }));


/***/ }),

/***/ 816:
/***/ ((__unused_webpack_module, exports) => {


/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ISarif = void 0;
class ISarif {
    constructor(data) {
        this._data = data;
    }
    /** Getter for a property by name */
    get(property) {
        const properties = Object.keys(this._data);
        if (properties.includes(property)) {
            return this._data[property];
        }
        throw new Error(`Property '${property}' does not exist.`);
    }
    /** Returns all SARIF properties */
    properties() {
        return this._data;
    }
}
exports.ISarif = ISarif;


/***/ }),

/***/ 578:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {


/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Log = void 0;
const fs = __importStar(__nccwpck_require__(896));
const run_1 = __nccwpck_require__(85);
const interfaces_1 = __nccwpck_require__(816);
const tool_1 = __nccwpck_require__(228);
const result_1 = __nccwpck_require__(955);
/** Static Analysis Results Format (SARIF) Version 2.1.0 */
class Log extends interfaces_1.ISarif {
    constructor() {
        super({
            $schema: "http://json.schemastore.org/sarif-2.1.0.json",
            version: "2.1.0",
            runs: []
        });
    }
    /**
     * Adds a single run to the SARIF log
     */
    addRun(run) {
        this._data.runs.push(run.properties());
        return this;
    }
    /**
     * Creates a new SARIF log object from a file
     *
     * @param filePath The path to the SARIF file
     * @returns A new SARIF log object
     */
    static fromFile(filePath) {
        const data = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
        const log = new Log();
        if (Object.keys(data).includes("runs") && Array.isArray(data.runs)) {
            for (const sarifRun of data.runs) {
                const tool = new tool_1.Tool(sarifRun.tool.driver.name, sarifRun.tool.driver);
                const run = new run_1.Run(tool);
                if (Object.keys(sarifRun).includes("results") && Array.isArray(sarifRun.results)) {
                    for (const result of sarifRun.results) {
                        const res = new result_1.Result(result.message, result);
                        run.addResult(res);
                    }
                }
                log.addRun(run);
            }
        }
        return log;
    }
}
exports.Log = Log;


/***/ }),

/***/ 955:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Result = void 0;
const interfaces_1 = __nccwpck_require__(816);
/** A result produced by an analysis tool. */
class Result extends interfaces_1.ISarif {
    /** A result produced by an analysis tool. */
    constructor(message, options = {}) {
        const msg = typeof message === "string" ? { text: message } : message;
        super({
            message: msg,
            ...options
        });
    }
    /** The stable, unique identifier of the rule, if any, to which this result is relevant. */
    ruleId(ruleId) {
        this._data.ruleId = ruleId;
        return this;
    }
    /** A value specifying the severity level of the result. */
    level(level) {
        this._data.level = level;
        return this;
    }
    /** Encapsulates a message intended to be read by the end user. */
    message(message) {
        this._data.message = typeof message === "string" ? { text: message } : message;
        return this;
    }
    /**
     * Extends the set of locations where the result was detected. Specify only one location
     * unless the problem indicated by the result can only be corrected by making a change
     * at every specified location.
     */
    addLocation(location) {
        var _a;
        if (this._data.locations === undefined) {
            this._data.locations = [];
        }
        this._data.locations.push(location);
        this._data.occurrenceCount = ((_a = this._data.occurrenceCount) !== null && _a !== void 0 ? _a : 0) + 1;
        return this;
    }
}
exports.Result = Result;


/***/ }),

/***/ 64:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Rule = void 0;
const interfaces_1 = __nccwpck_require__(816);
/** Metadata that describes a specific report produced by the tool, as part of the analysis it provides or its runtime reporting. */
class Rule extends interfaces_1.ISarif {
    /** Metadata that describes a specific report produced by the tool, as part of the analysis it provides or its runtime reporting. */
    constructor(id, options = {}) {
        const short = typeof options.shortDescription === "string" ? { text: options.shortDescription } : options.shortDescription;
        const full = typeof options.fullDescription === "string" ? { text: options.fullDescription } : options.fullDescription;
        if (short === undefined && full === undefined) {
            super({ id: id });
        }
        else if (short !== undefined && full === undefined) {
            super({
                id: id,
                shortDescription: short
            });
        }
        else if (short === undefined && full !== undefined) {
            super({
                id: id,
                fullDescription: full
            });
        }
        else {
            super({
                id: id,
                shortDescription: short,
                fullDescription: full
            });
        }
    }
    /** A report identifier that is understandable to an end user. */
    name(name) {
        this._data.name = name;
        return this;
    }
    /**
     * A concise description of the report. Should be a single sentence that is understandable when visible
     * space is limited to a single line of text.
     */
    shortDescription(shortDescription) {
        this._data.shortDescription = typeof shortDescription === "string" ? { text: shortDescription } : shortDescription;
        return this;
    }
    /**
     * A description of the report. Should, as far as possible, provide details sufficient to enable resolution
     * of any problem indicated by the result.
     */
    fullDescription(fullDescription) {
        this._data.fullDescription = typeof fullDescription === "string" ? { text: fullDescription } : fullDescription;
        return this;
    }
    /** A URI where the primary documentation for the report can be found. */
    helpUri(helpUri) {
        this._data.helpUri = helpUri;
        return this;
    }
}
exports.Rule = Rule;


/***/ }),

/***/ 85:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Run = void 0;
const interfaces_1 = __nccwpck_require__(816);
/** Describes a single run of an analysis tool, and contains the reported output of that run. */
class Run extends interfaces_1.ISarif {
    /**
     * Describes a single run of an analysis tool, and contains the reported output of that run.
     * @param tool The tool or tool pipeline that generated the results in this run.
     */
    constructor(tool) {
        super({
            tool: tool.properties()
        });
    }
    /**
     * Information about the tool or tool pipeline that generated the results in this run. A run can only
     * contain results produced by a single tool or tool pipeline. A run can aggregate results from multiple
     * log files, as long as context around the tool run (tool command-line arguments and the like) is
     * identical for all aggregated files.
     */
    tool(tool) {
        this._data.tool = tool.properties();
        return this;
    }
    /**
     * Extends the set of results contained in an SARIF log. The results array can be omitted when a run
     * is solely exporting rules metadata. It must be present (but may be empty) if a log file represents
     * an actual scan.
     */
    addResult(result) {
        var _a, _b, _c, _d;
        if (this._data.results === undefined) {
            this._data.results = [];
        }
        for (const item of this._data.results) {
            if (item.message.text === result.properties().message.text) {
                (_a = item.locations) === null || _a === void 0 ? void 0 : _a.push(...(_b = result.properties().locations) !== null && _b !== void 0 ? _b : []);
                item.occurrenceCount = ((_c = item.occurrenceCount) !== null && _c !== void 0 ? _c : 1) + ((_d = result.properties().occurrenceCount) !== null && _d !== void 0 ? _d : 1);
                return this;
            }
        }
        this._data.results.push(result.properties());
        return this;
    }
}
exports.Run = Run;


/***/ }),

/***/ 228:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {


/**
 * SPDX-FileCopyrightText: 2023 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Tool = void 0;
const interfaces_1 = __nccwpck_require__(816);
/** The analysis tool that was run. */
class Tool extends interfaces_1.ISarif {
    //private _data: sarif.Tool;
    constructor(name, options = {}) {
        super({
            driver: {
                name: name,
                ...options
            }
        });
    }
    /** The name of the tool component. */
    name(name) {
        this._data.driver.name = name;
        return this;
    }
    /** The organization or company that produced the tool component. */
    organization(organization) {
        this._data.driver.organization = organization;
        return this;
    }
    /** The tool component version, in whatever format the component natively provides. */
    version(version) {
        this._data.driver.version = version;
        return this;
    }
    /** The absolute URI at which information about this version of the tool component can be found. */
    informationUri(informationUri) {
        this._data.driver.informationUri = informationUri;
        return this;
    }
    /** Extends the list of rules relevant to the analysis performed by the tool component. */
    addRule(rule) {
        if (this._data.driver.rules === undefined) {
            this._data.driver.rules = [];
        }
        if (this._data.driver.rules.some(r => r.id === rule.get("id"))) {
            this._data.driver.rules = this._data.driver.rules.filter(r => r.id !== rule.get("id"));
        }
        this._data.driver.rules.push(rule.properties());
        return this;
    }
    /** Getter for a property by name */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    get(property) {
        const properties = Object.keys(this._data.driver);
        if (properties.includes(property)) {
            return this._data.driver[property];
        }
        throw new Error(`Property '${property}' does not exist.`);
    }
}
exports.Tool = Tool;


/***/ }),

/***/ 896:
/***/ ((module) => {

module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __nccwpck_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	var threw = true;
/******/ 	try {
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 		threw = false;
/******/ 	} finally {
/******/ 		if(threw) delete __webpack_module_cache__[moduleId];
/******/ 	}
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/asset-relocator-loader */
/******/ if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = decodeURIComponent(new URL('.', import.meta.url).pathname).slice(import.meta.url.match(/^file:\/\/\/\w:/) ? 1 : 0, -1) + "/";
/******/ 
/************************************************************************/
var __webpack_exports__ = {};

;// CONCATENATED MODULE: external "node:fs"
const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
;// CONCATENATED MODULE: ./node_modules/commander/lib/error.js
/**
 * CommanderError class
 */
class CommanderError extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   */
  constructor(exitCode, code, message) {
    super(message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = undefined;
  }
}

/**
 * InvalidArgumentError class
 */
class InvalidArgumentError extends CommanderError {
  /**
   * Constructs the InvalidArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   */
  constructor(message) {
    super(1, 'commander.invalidArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

;// CONCATENATED MODULE: ./node_modules/commander/lib/argument.js


class argument_Argument {
  /**
   * Initialize a new command argument with the given name and description.
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @param {string} name
   * @param {string} [description]
   */

  constructor(name, description) {
    this.description = description || '';
    this.variadic = false;
    this.parseArg = undefined;
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.argChoices = undefined;

    switch (name[0]) {
      case '<': // e.g. <required>
        this.required = true;
        this._name = name.slice(1, -1);
        break;
      case '[': // e.g. [optional]
        this.required = false;
        this._name = name.slice(1, -1);
        break;
      default:
        this.required = true;
        this._name = name;
        break;
    }

    if (this._name.endsWith('...')) {
      this.variadic = true;
      this._name = this._name.slice(0, -3);
    }
  }

  /**
   * Return argument name.
   *
   * @return {string}
   */

  name() {
    return this._name;
  }

  /**
   * @package
   */

  _collectValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    previous.push(value);
    return previous;
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {*} value
   * @param {string} [description]
   * @return {Argument}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }

  /**
   * Set the custom handler for processing CLI command arguments into argument values.
   *
   * @param {Function} [fn]
   * @return {Argument}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  }

  /**
   * Only allow argument value to be one of choices.
   *
   * @param {string[]} values
   * @return {Argument}
   */

  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(
          `Allowed choices are ${this.argChoices.join(', ')}.`,
        );
      }
      if (this.variadic) {
        return this._collectValue(arg, previous);
      }
      return arg;
    };
    return this;
  }

  /**
   * Make argument required.
   *
   * @returns {Argument}
   */
  argRequired() {
    this.required = true;
    return this;
  }

  /**
   * Make argument optional.
   *
   * @returns {Argument}
   */
  argOptional() {
    this.required = false;
    return this;
  }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Argument} arg
 * @return {string}
 * @private
 */

function humanReadableArgName(arg) {
  const nameOutput = arg.name() + (arg.variadic === true ? '...' : '');

  return arg.required ? '<' + nameOutput + '>' : '[' + nameOutput + ']';
}

;// CONCATENATED MODULE: external "node:events"
const external_node_events_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:events");
;// CONCATENATED MODULE: external "node:child_process"
const external_node_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
;// CONCATENATED MODULE: external "node:path"
const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");
;// CONCATENATED MODULE: external "node:process"
const external_node_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:process");
;// CONCATENATED MODULE: external "node:util"
const external_node_util_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:util");
;// CONCATENATED MODULE: ./node_modules/commander/lib/help.js



/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 * @typedef { import("./argument.js").Argument } Argument
 * @typedef { import("./command.js").Command } Command
 * @typedef { import("./option.js").Option } Option
 */

// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help {
  constructor() {
    this.helpWidth = undefined;
    this.minWidthToWrap = 40;
    this.sortSubcommands = false;
    this.sortOptions = false;
    this.showGlobalOptions = false;
  }

  /**
   * prepareContext is called by Commander after applying overrides from `Command.configureHelp()`
   * and just before calling `formatHelp()`.
   *
   * Commander just uses the helpWidth and the rest is provided for optional use by more complex subclasses.
   *
   * @param {{ error?: boolean, helpWidth?: number, outputHasColors?: boolean }} contextOptions
   */
  prepareContext(contextOptions) {
    this.helpWidth = this.helpWidth ?? contextOptions.helpWidth ?? 80;
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */

  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter((cmd) => !cmd._hidden);
    const helpCommand = cmd._getHelpCommand();
    if (helpCommand && !helpCommand._hidden) {
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        // @ts-ignore: because overloaded return type
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }

  /**
   * Compare options for sort.
   *
   * @param {Option} a
   * @param {Option} b
   * @returns {number}
   */
  compareOptions(a, b) {
    const getSortKey = (option) => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short
        ? option.short.replace(/^-/, '')
        : option.long.replace(/^--/, '');
    };
    return getSortKey(a).localeCompare(getSortKey(b));
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Built-in help option.
    const helpOption = cmd._getHelpOption();
    if (helpOption && !helpOption.hidden) {
      // Automatically hide conflicting flags. Bit dubious but a historical behaviour that is convenient for single-command programs.
      const removeShort = helpOption.short && cmd._findOption(helpOption.short);
      const removeLong = helpOption.long && cmd._findOption(helpOption.long);
      if (!removeShort && !removeLong) {
        visibleOptions.push(helpOption); // no changes needed
      } else if (helpOption.long && !removeLong) {
        visibleOptions.push(
          cmd.createOption(helpOption.long, helpOption.description),
        );
      } else if (helpOption.short && !removeShort) {
        visibleOptions.push(
          cmd.createOption(helpOption.short, helpOption.description),
        );
      }
    }
    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions);
    }
    return visibleOptions;
  }

  /**
   * Get an array of the visible global options. (Not including help.)
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleGlobalOptions(cmd) {
    if (!this.showGlobalOptions) return [];

    const globalOptions = [];
    for (
      let ancestorCmd = cmd.parent;
      ancestorCmd;
      ancestorCmd = ancestorCmd.parent
    ) {
      const visibleOptions = ancestorCmd.options.filter(
        (option) => !option.hidden,
      );
      globalOptions.push(...visibleOptions);
    }
    if (this.sortOptions) {
      globalOptions.sort(this.compareOptions);
    }
    return globalOptions;
  }

  /**
   * Get an array of the arguments if any have a description.
   *
   * @param {Command} cmd
   * @returns {Argument[]}
   */

  visibleArguments(cmd) {
    // Side effect! Apply the legacy descriptions before the arguments are displayed.
    if (cmd._argsDescription) {
      cmd.registeredArguments.forEach((argument) => {
        argument.description =
          argument.description || cmd._argsDescription[argument.name()] || '';
      });
    }

    // If there are any arguments with a description then return all the arguments.
    if (cmd.registeredArguments.find((argument) => argument.description)) {
      return cmd.registeredArguments;
    }
    return [];
  }

  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandTerm(cmd) {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd.registeredArguments
      .map((arg) => humanReadableArgName(arg))
      .join(' ');
    return (
      cmd._name +
      (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '')
    );
  }

  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */

  optionTerm(option) {
    return option.flags;
  }

  /**
   * Get the argument term to show in the list of arguments.
   *
   * @param {Argument} argument
   * @returns {string}
   */

  argumentTerm(argument) {
    return argument.name();
  }

  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(
        max,
        this.displayWidth(
          helper.styleSubcommandTerm(helper.subcommandTerm(command)),
        ),
      );
    }, 0);
  }

  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(
        max,
        this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))),
      );
    }, 0);
  }

  /**
   * Get the longest global option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestGlobalOptionTermLength(cmd, helper) {
    return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
      return Math.max(
        max,
        this.displayWidth(helper.styleOptionTerm(helper.optionTerm(option))),
      );
    }, 0);
  }

  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(
        max,
        this.displayWidth(
          helper.styleArgumentTerm(helper.argumentTerm(argument)),
        ),
      );
    }, 0);
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandUsage(cmd) {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + '|' + cmd._aliases[0];
    }
    let ancestorCmdNames = '';
    for (
      let ancestorCmd = cmd.parent;
      ancestorCmd;
      ancestorCmd = ancestorCmd.parent
    ) {
      ancestorCmdNames = ancestorCmd.name() + ' ' + ancestorCmdNames;
    }
    return ancestorCmdNames + cmdName + ' ' + cmd.usage();
  }

  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandDescription(cmd) {
    // @ts-ignore: because overloaded return type
    return cmd.description();
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandDescription(cmd) {
    // @ts-ignore: because overloaded return type
    return cmd.summary() || cmd.description();
  }

  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */

  optionDescription(option) {
    const extraInfo = [];

    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`,
      );
    }
    if (option.defaultValue !== undefined) {
      // default for boolean and negated more for programmer than end user,
      // but show true/false for boolean option as may be for hand-rolled env or config processing.
      const showDefault =
        option.required ||
        option.optional ||
        (option.isBoolean() && typeof option.defaultValue === 'boolean');
      if (showDefault) {
        extraInfo.push(
          `default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`,
        );
      }
    }
    // preset for boolean and negated are more for programmer than end user
    if (option.presetArg !== undefined && option.optional) {
      extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
    }
    if (option.envVar !== undefined) {
      extraInfo.push(`env: ${option.envVar}`);
    }
    if (extraInfo.length > 0) {
      const extraDescription = `(${extraInfo.join(', ')})`;
      if (option.description) {
        return `${option.description} ${extraDescription}`;
      }
      return extraDescription;
    }

    return option.description;
  }

  /**
   * Get the argument description to show in the list of arguments.
   *
   * @param {Argument} argument
   * @return {string}
   */

  argumentDescription(argument) {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`,
      );
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(
        `default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`,
      );
    }
    if (extraInfo.length > 0) {
      const extraDescription = `(${extraInfo.join(', ')})`;
      if (argument.description) {
        return `${argument.description} ${extraDescription}`;
      }
      return extraDescription;
    }
    return argument.description;
  }

  /**
   * Format a list of items, given a heading and an array of formatted items.
   *
   * @param {string} heading
   * @param {string[]} items
   * @param {Help} helper
   * @returns string[]
   */
  formatItemList(heading, items, helper) {
    if (items.length === 0) return [];

    return [helper.styleTitle(heading), ...items, ''];
  }

  /**
   * Group items by their help group heading.
   *
   * @param {Command[] | Option[]} unsortedItems
   * @param {Command[] | Option[]} visibleItems
   * @param {Function} getGroup
   * @returns {Map<string, Command[] | Option[]>}
   */
  groupItems(unsortedItems, visibleItems, getGroup) {
    const result = new Map();
    // Add groups in order of appearance in unsortedItems.
    unsortedItems.forEach((item) => {
      const group = getGroup(item);
      if (!result.has(group)) result.set(group, []);
    });
    // Add items in order of appearance in visibleItems.
    visibleItems.forEach((item) => {
      const group = getGroup(item);
      if (!result.has(group)) {
        result.set(group, []);
      }
      result.get(group).push(item);
    });
    return result;
  }

  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */

  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth ?? 80; // in case prepareContext() was not called

    function callFormatItem(term, description) {
      return helper.formatItem(term, termWidth, description, helper);
    }

    // Usage
    let output = [
      `${helper.styleTitle('Usage:')} ${helper.styleUsage(helper.commandUsage(cmd))}`,
      '',
    ];

    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([
        helper.boxWrap(
          helper.styleCommandDescription(commandDescription),
          helpWidth,
        ),
        '',
      ]);
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return callFormatItem(
        helper.styleArgumentTerm(helper.argumentTerm(argument)),
        helper.styleArgumentDescription(helper.argumentDescription(argument)),
      );
    });
    output = output.concat(
      this.formatItemList('Arguments:', argumentList, helper),
    );

    // Options
    const optionGroups = this.groupItems(
      cmd.options,
      helper.visibleOptions(cmd),
      (option) => option.helpGroupHeading ?? 'Options:',
    );
    optionGroups.forEach((options, group) => {
      const optionList = options.map((option) => {
        return callFormatItem(
          helper.styleOptionTerm(helper.optionTerm(option)),
          helper.styleOptionDescription(helper.optionDescription(option)),
        );
      });
      output = output.concat(this.formatItemList(group, optionList, helper));
    });

    if (helper.showGlobalOptions) {
      const globalOptionList = helper
        .visibleGlobalOptions(cmd)
        .map((option) => {
          return callFormatItem(
            helper.styleOptionTerm(helper.optionTerm(option)),
            helper.styleOptionDescription(helper.optionDescription(option)),
          );
        });
      output = output.concat(
        this.formatItemList('Global Options:', globalOptionList, helper),
      );
    }

    // Commands
    const commandGroups = this.groupItems(
      cmd.commands,
      helper.visibleCommands(cmd),
      (sub) => sub.helpGroup() || 'Commands:',
    );
    commandGroups.forEach((commands, group) => {
      const commandList = commands.map((sub) => {
        return callFormatItem(
          helper.styleSubcommandTerm(helper.subcommandTerm(sub)),
          helper.styleSubcommandDescription(helper.subcommandDescription(sub)),
        );
      });
      output = output.concat(this.formatItemList(group, commandList, helper));
    });

    return output.join('\n');
  }

  /**
   * Return display width of string, ignoring ANSI escape sequences. Used in padding and wrapping calculations.
   *
   * @param {string} str
   * @returns {number}
   */
  displayWidth(str) {
    return (0,external_node_util_namespaceObject.stripVTControlCharacters)(str).length;
  }

  /**
   * Style the title for displaying in the help. Called with 'Usage:', 'Options:', etc.
   *
   * @param {string} str
   * @returns {string}
   */
  styleTitle(str) {
    return str;
  }

  styleUsage(str) {
    // Usage has lots of parts the user might like to color separately! Assume default usage string which is formed like:
    //    command subcommand [options] [command] <foo> [bar]
    return str
      .split(' ')
      .map((word) => {
        if (word === '[options]') return this.styleOptionText(word);
        if (word === '[command]') return this.styleSubcommandText(word);
        if (word[0] === '[' || word[0] === '<')
          return this.styleArgumentText(word);
        return this.styleCommandText(word); // Restrict to initial words?
      })
      .join(' ');
  }
  styleCommandDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleOptionDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleSubcommandDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleArgumentDescription(str) {
    return this.styleDescriptionText(str);
  }
  styleDescriptionText(str) {
    return str;
  }
  styleOptionTerm(str) {
    return this.styleOptionText(str);
  }
  styleSubcommandTerm(str) {
    // This is very like usage with lots of parts! Assume default string which is formed like:
    //    subcommand [options] <foo> [bar]
    return str
      .split(' ')
      .map((word) => {
        if (word === '[options]') return this.styleOptionText(word);
        if (word[0] === '[' || word[0] === '<')
          return this.styleArgumentText(word);
        return this.styleSubcommandText(word); // Restrict to initial words?
      })
      .join(' ');
  }
  styleArgumentTerm(str) {
    return this.styleArgumentText(str);
  }
  styleOptionText(str) {
    return str;
  }
  styleArgumentText(str) {
    return str;
  }
  styleSubcommandText(str) {
    return str;
  }
  styleCommandText(str) {
    return str;
  }

  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestGlobalOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper),
    );
  }

  /**
   * Detect manually wrapped and indented strings by checking for line break followed by whitespace.
   *
   * @param {string} str
   * @returns {boolean}
   */
  preformatted(str) {
    return /\n[^\S\r\n]/.test(str);
  }

  /**
   * Format the "item", which consists of a term and description. Pad the term and wrap the description, indenting the following lines.
   *
   * So "TTT", 5, "DDD DDDD DD DDD" might be formatted for this.helpWidth=17 like so:
   *   TTT  DDD DDDD
   *        DD DDD
   *
   * @param {string} term
   * @param {number} termWidth
   * @param {string} description
   * @param {Help} helper
   * @returns {string}
   */
  formatItem(term, termWidth, description, helper) {
    const itemIndent = 2;
    const itemIndentStr = ' '.repeat(itemIndent);
    if (!description) return itemIndentStr + term;

    // Pad the term out to a consistent width, so descriptions are aligned.
    const paddedTerm = term.padEnd(
      termWidth + term.length - helper.displayWidth(term),
    );

    // Format the description.
    const spacerWidth = 2; // between term and description
    const helpWidth = this.helpWidth ?? 80; // in case prepareContext() was not called
    const remainingWidth = helpWidth - termWidth - spacerWidth - itemIndent;
    let formattedDescription;
    if (
      remainingWidth < this.minWidthToWrap ||
      helper.preformatted(description)
    ) {
      formattedDescription = description;
    } else {
      const wrappedDescription = helper.boxWrap(description, remainingWidth);
      formattedDescription = wrappedDescription.replace(
        /\n/g,
        '\n' + ' '.repeat(termWidth + spacerWidth),
      );
    }

    // Construct and overall indent.
    return (
      itemIndentStr +
      paddedTerm +
      ' '.repeat(spacerWidth) +
      formattedDescription.replace(/\n/g, `\n${itemIndentStr}`)
    );
  }

  /**
   * Wrap a string at whitespace, preserving existing line breaks.
   * Wrapping is skipped if the width is less than `minWidthToWrap`.
   *
   * @param {string} str
   * @param {number} width
   * @returns {string}
   */
  boxWrap(str, width) {
    if (width < this.minWidthToWrap) return str;

    const rawLines = str.split(/\r\n|\n/);
    // split up text by whitespace
    const chunkPattern = /[\s]*[^\s]+/g;
    const wrappedLines = [];
    rawLines.forEach((line) => {
      const chunks = line.match(chunkPattern);
      if (chunks === null) {
        wrappedLines.push('');
        return;
      }

      let sumChunks = [chunks.shift()];
      let sumWidth = this.displayWidth(sumChunks[0]);
      chunks.forEach((chunk) => {
        const visibleWidth = this.displayWidth(chunk);
        // Accumulate chunks while they fit into width.
        if (sumWidth + visibleWidth <= width) {
          sumChunks.push(chunk);
          sumWidth += visibleWidth;
          return;
        }
        wrappedLines.push(sumChunks.join(''));

        const nextChunk = chunk.trimStart(); // trim space at line break
        sumChunks = [nextChunk];
        sumWidth = this.displayWidth(nextChunk);
      });
      wrappedLines.push(sumChunks.join(''));
    });

    return wrappedLines.join('\n');
  }
}

;// CONCATENATED MODULE: ./node_modules/commander/lib/option.js


class option_Option {
  /**
   * Initialize a new `Option` with the given `flags` and `description`.
   *
   * @param {string} flags
   * @param {string} [description]
   */

  constructor(flags, description) {
    this.flags = flags;
    this.description = description || '';

    this.required = flags.includes('<'); // A value must be supplied when the option is specified.
    this.optional = flags.includes('['); // A value is optional when the option is specified.
    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
    const optionFlags = splitOptionFlags(flags);
    this.short = optionFlags.shortFlag; // May be a short flag, undefined, or even a long flag (if option has two long flags).
    this.long = optionFlags.longFlag;
    this.negate = false;
    if (this.long) {
      this.negate = this.long.startsWith('--no-');
    }
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.presetArg = undefined;
    this.envVar = undefined;
    this.parseArg = undefined;
    this.hidden = false;
    this.argChoices = undefined;
    this.conflictsWith = [];
    this.implied = undefined;
    this.helpGroupHeading = undefined; // soft initialised when option added to command
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {*} value
   * @param {string} [description]
   * @return {Option}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  }

  /**
   * Preset to use when option used without option-argument, especially optional but also boolean and negated.
   * The custom processing (parseArg) is called.
   *
   * @example
   * new Option('--color').default('GREYSCALE').preset('RGB');
   * new Option('--donate [amount]').preset('20').argParser(parseFloat);
   *
   * @param {*} arg
   * @return {Option}
   */

  preset(arg) {
    this.presetArg = arg;
    return this;
  }

  /**
   * Add option name(s) that conflict with this option.
   * An error will be displayed if conflicting options are found during parsing.
   *
   * @example
   * new Option('--rgb').conflicts('cmyk');
   * new Option('--js').conflicts(['ts', 'jsx']);
   *
   * @param {(string | string[])} names
   * @return {Option}
   */

  conflicts(names) {
    this.conflictsWith = this.conflictsWith.concat(names);
    return this;
  }

  /**
   * Specify implied option values for when this option is set and the implied options are not.
   *
   * The custom processing (parseArg) is not called on the implied values.
   *
   * @example
   * program
   *   .addOption(new Option('--log', 'write logging information to file'))
   *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
   *
   * @param {object} impliedOptionValues
   * @return {Option}
   */
  implies(impliedOptionValues) {
    let newImplied = impliedOptionValues;
    if (typeof impliedOptionValues === 'string') {
      // string is not documented, but easy mistake and we can do what user probably intended.
      newImplied = { [impliedOptionValues]: true };
    }
    this.implied = Object.assign(this.implied || {}, newImplied);
    return this;
  }

  /**
   * Set environment variable to check for option value.
   *
   * An environment variable is only used if when processed the current option value is
   * undefined, or the source of the current value is 'default' or 'config' or 'env'.
   *
   * @param {string} name
   * @return {Option}
   */

  env(name) {
    this.envVar = name;
    return this;
  }

  /**
   * Set the custom handler for processing CLI option arguments into option values.
   *
   * @param {Function} [fn]
   * @return {Option}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  }

  /**
   * Whether the option is mandatory and must have a value after parsing.
   *
   * @param {boolean} [mandatory=true]
   * @return {Option}
   */

  makeOptionMandatory(mandatory = true) {
    this.mandatory = !!mandatory;
    return this;
  }

  /**
   * Hide option in help.
   *
   * @param {boolean} [hide=true]
   * @return {Option}
   */

  hideHelp(hide = true) {
    this.hidden = !!hide;
    return this;
  }

  /**
   * @package
   */

  _collectValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    previous.push(value);
    return previous;
  }

  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Option}
   */

  choices(values) {
    this.argChoices = values.slice();
    this.parseArg = (arg, previous) => {
      if (!this.argChoices.includes(arg)) {
        throw new InvalidArgumentError(
          `Allowed choices are ${this.argChoices.join(', ')}.`,
        );
      }
      if (this.variadic) {
        return this._collectValue(arg, previous);
      }
      return arg;
    };
    return this;
  }

  /**
   * Return option name.
   *
   * @return {string}
   */

  name() {
    if (this.long) {
      return this.long.replace(/^--/, '');
    }
    return this.short.replace(/^-/, '');
  }

  /**
   * Return option name, in a camelcase format that can be used
   * as an object attribute key.
   *
   * @return {string}
   */

  attributeName() {
    if (this.negate) {
      return camelcase(this.name().replace(/^no-/, ''));
    }
    return camelcase(this.name());
  }

  /**
   * Set the help group heading.
   *
   * @param {string} heading
   * @return {Option}
   */
  helpGroup(heading) {
    this.helpGroupHeading = heading;
    return this;
  }

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   * @package
   */

  is(arg) {
    return this.short === arg || this.long === arg;
  }

  /**
   * Return whether a boolean option.
   *
   * Options are one of boolean, negated, required argument, or optional argument.
   *
   * @return {boolean}
   * @package
   */

  isBoolean() {
    return !this.required && !this.optional && !this.negate;
  }
}

/**
 * This class is to make it easier to work with dual options, without changing the existing
 * implementation. We support separate dual options for separate positive and negative options,
 * like `--build` and `--no-build`, which share a single option value. This works nicely for some
 * use cases, but is tricky for others where we want separate behaviours despite
 * the single shared option value.
 */
class DualOptions {
  /**
   * @param {Option[]} options
   */
  constructor(options) {
    this.positiveOptions = new Map();
    this.negativeOptions = new Map();
    this.dualOptions = new Set();
    options.forEach((option) => {
      if (option.negate) {
        this.negativeOptions.set(option.attributeName(), option);
      } else {
        this.positiveOptions.set(option.attributeName(), option);
      }
    });
    this.negativeOptions.forEach((value, key) => {
      if (this.positiveOptions.has(key)) {
        this.dualOptions.add(key);
      }
    });
  }

  /**
   * Did the value come from the option, and not from possible matching dual option?
   *
   * @param {*} value
   * @param {Option} option
   * @returns {boolean}
   */
  valueFromOption(value, option) {
    const optionKey = option.attributeName();
    if (!this.dualOptions.has(optionKey)) return true;

    // Use the value to deduce if (probably) came from the option.
    const preset = this.negativeOptions.get(optionKey).presetArg;
    const negativeValue = preset !== undefined ? preset : false;
    return option.negate === (negativeValue === value);
  }
}

/**
 * Convert string from kebab-case to camelCase.
 *
 * @param {string} str
 * @return {string}
 * @private
 */

function camelcase(str) {
  return str.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Split the short and long flag out of something like '-m,--mixed <value>'
 *
 * @private
 */

function splitOptionFlags(flags) {
  let shortFlag;
  let longFlag;
  // short flag, single dash and single character
  const shortFlagExp = /^-[^-]$/;
  // long flag, double dash and at least one character
  const longFlagExp = /^--[^-]/;

  const flagParts = flags.split(/[ |,]+/).concat('guard');
  // Normal is short and/or long.
  if (shortFlagExp.test(flagParts[0])) shortFlag = flagParts.shift();
  if (longFlagExp.test(flagParts[0])) longFlag = flagParts.shift();
  // Long then short. Rarely used but fine.
  if (!shortFlag && shortFlagExp.test(flagParts[0]))
    shortFlag = flagParts.shift();
  // Allow two long flags, like '--ws, --workspace'
  // This is the supported way to have a shortish option flag.
  if (!shortFlag && longFlagExp.test(flagParts[0])) {
    shortFlag = longFlag;
    longFlag = flagParts.shift();
  }

  // Check for unprocessed flag. Fail noisily rather than silently ignore.
  if (flagParts[0].startsWith('-')) {
    const unsupportedFlag = flagParts[0];
    const baseError = `option creation failed due to '${unsupportedFlag}' in option flags '${flags}'`;
    if (/^-[^-][^-]/.test(unsupportedFlag))
      throw new Error(
        `${baseError}
- a short flag is a single dash and a single character
  - either use a single dash and a single character (for a short flag)
  - or use a double dash for a long option (and can have two, like '--ws, --workspace')`,
      );
    if (shortFlagExp.test(unsupportedFlag))
      throw new Error(`${baseError}
- too many short flags`);
    if (longFlagExp.test(unsupportedFlag))
      throw new Error(`${baseError}
- too many long flags`);

    throw new Error(`${baseError}
- unrecognised flag format`);
  }
  if (shortFlag === undefined && longFlag === undefined)
    throw new Error(
      `option creation failed due to no flags found in '${flags}'.`,
    );

  return { shortFlag, longFlag };
}

;// CONCATENATED MODULE: ./node_modules/commander/lib/suggestSimilar.js
const maxDistance = 3;

function editDistance(a, b) {
  // https://en.wikipedia.org/wiki/Damerau–Levenshtein_distance
  // Calculating optimal string alignment distance, no substring is edited more than once.
  // (Simple implementation.)

  // Quick early exit, return worst case.
  if (Math.abs(a.length - b.length) > maxDistance)
    return Math.max(a.length, b.length);

  // distance between prefix substrings of a and b
  const d = [];

  // pure deletions turn a into empty string
  for (let i = 0; i <= a.length; i++) {
    d[i] = [i];
  }
  // pure insertions turn empty string into b
  for (let j = 0; j <= b.length; j++) {
    d[0][j] = j;
  }

  // fill matrix
  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      let cost;
      if (a[i - 1] === b[j - 1]) {
        cost = 0;
      } else {
        cost = 1;
      }
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost, // substitution
      );
      // transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[a.length][b.length];
}

/**
 * Find close matches, restricted to same number of edits.
 *
 * @param {string} word
 * @param {string[]} candidates
 * @returns {string}
 */

function suggestSimilar(word, candidates) {
  if (!candidates || candidates.length === 0) return '';
  // remove possible duplicates
  candidates = Array.from(new Set(candidates));

  const searchingOptions = word.startsWith('--');
  if (searchingOptions) {
    word = word.slice(2);
    candidates = candidates.map((candidate) => candidate.slice(2));
  }

  let similar = [];
  let bestDistance = maxDistance;
  const minSimilarity = 0.4;
  candidates.forEach((candidate) => {
    if (candidate.length <= 1) return; // no one character guesses

    const distance = editDistance(word, candidate);
    const length = Math.max(word.length, candidate.length);
    const similarity = (length - distance) / length;
    if (similarity > minSimilarity) {
      if (distance < bestDistance) {
        // better edit distance, throw away previous worse matches
        bestDistance = distance;
        similar = [candidate];
      } else if (distance === bestDistance) {
        similar.push(candidate);
      }
    }
  });

  similar.sort((a, b) => a.localeCompare(b));
  if (searchingOptions) {
    similar = similar.map((candidate) => `--${candidate}`);
  }

  if (similar.length > 1) {
    return `\n(Did you mean one of ${similar.join(', ')}?)`;
  }
  if (similar.length === 1) {
    return `\n(Did you mean ${similar[0]}?)`;
  }
  return '';
}

;// CONCATENATED MODULE: ./node_modules/commander/lib/command.js













class command_Command extends external_node_events_namespaceObject.EventEmitter {
  /**
   * Initialize a new `Command`.
   *
   * @param {string} [name]
   */

  constructor(name) {
    super();
    /** @type {Command[]} */
    this.commands = [];
    /** @type {Option[]} */
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = false;
    /** @type {Argument[]} */
    this.registeredArguments = [];
    this._args = this.registeredArguments; // deprecated old name
    /** @type {string[]} */
    this.args = []; // cli args with options removed
    this.rawArgs = [];
    this.processedArgs = []; // like .args but after custom processing and collecting variadic
    this._scriptPath = null;
    this._name = name || '';
    this._optionValues = {};
    this._optionValueSources = {}; // default, env, cli etc
    this._storeOptionsAsProperties = false;
    this._actionHandler = null;
    this._executableHandler = false;
    this._executableFile = null; // custom name for executable
    this._executableDir = null; // custom search directory for subcommands
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = true;
    this._description = '';
    this._summary = '';
    this._argsDescription = undefined; // legacy
    this._enablePositionalOptions = false;
    this._passThroughOptions = false;
    this._lifeCycleHooks = {}; // a hash of arrays
    /** @type {(boolean | string)} */
    this._showHelpAfterError = false;
    this._showSuggestionAfterError = true;
    this._savedState = null; // used in save/restoreStateBeforeParse

    // see configureOutput() for docs
    this._outputConfiguration = {
      writeOut: (str) => external_node_process_namespaceObject.stdout.write(str),
      writeErr: (str) => external_node_process_namespaceObject.stderr.write(str),
      outputError: (str, write) => write(str),
      getOutHelpWidth: () =>
        external_node_process_namespaceObject.stdout.isTTY ? external_node_process_namespaceObject.stdout.columns : undefined,
      getErrHelpWidth: () =>
        external_node_process_namespaceObject.stderr.isTTY ? external_node_process_namespaceObject.stderr.columns : undefined,
      getOutHasColors: () =>
        useColor() ?? (external_node_process_namespaceObject.stdout.isTTY && external_node_process_namespaceObject.stdout.hasColors?.()),
      getErrHasColors: () =>
        useColor() ?? (external_node_process_namespaceObject.stderr.isTTY && external_node_process_namespaceObject.stderr.hasColors?.()),
      stripColor: (str) => (0,external_node_util_namespaceObject.stripVTControlCharacters)(str),
    };

    this._hidden = false;
    /** @type {(Option | null | undefined)} */
    this._helpOption = undefined; // Lazy created on demand. May be null if help option is disabled.
    this._addImplicitHelpCommand = undefined; // undecided whether true or false yet, not inherited
    /** @type {Command} */
    this._helpCommand = undefined; // lazy initialised, inherited
    this._helpConfiguration = {};
    /** @type {string | undefined} */
    this._helpGroupHeading = undefined; // soft initialised when added to parent
    /** @type {string | undefined} */
    this._defaultCommandGroup = undefined;
    /** @type {string | undefined} */
    this._defaultOptionGroup = undefined;
  }

  /**
   * Copy settings that are useful to have in common across root command and subcommands.
   *
   * (Used internally when adding a command using `.command()` so subcommands inherit parent settings.)
   *
   * @param {Command} sourceCommand
   * @return {Command} `this` command for chaining
   */
  copyInheritedSettings(sourceCommand) {
    this._outputConfiguration = sourceCommand._outputConfiguration;
    this._helpOption = sourceCommand._helpOption;
    this._helpCommand = sourceCommand._helpCommand;
    this._helpConfiguration = sourceCommand._helpConfiguration;
    this._exitCallback = sourceCommand._exitCallback;
    this._storeOptionsAsProperties = sourceCommand._storeOptionsAsProperties;
    this._combineFlagAndOptionalValue =
      sourceCommand._combineFlagAndOptionalValue;
    this._allowExcessArguments = sourceCommand._allowExcessArguments;
    this._enablePositionalOptions = sourceCommand._enablePositionalOptions;
    this._showHelpAfterError = sourceCommand._showHelpAfterError;
    this._showSuggestionAfterError = sourceCommand._showSuggestionAfterError;

    return this;
  }

  /**
   * @returns {Command[]}
   * @private
   */

  _getCommandAndAncestors() {
    const result = [];
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    for (let command = this; command; command = command.parent) {
      result.push(command);
    }
    return result;
  }

  /**
   * Define a command.
   *
   * There are two styles of command: pay attention to where to put the description.
   *
   * @example
   * // Command implemented using action handler (description is supplied separately to `.command`)
   * program
   *   .command('clone <source> [destination]')
   *   .description('clone a repository into a newly created directory')
   *   .action((source, destination) => {
   *     console.log('clone command called');
   *   });
   *
   * // Command implemented using separate executable file (description is second parameter to `.command`)
   * program
   *   .command('start <service>', 'start named service')
   *   .command('stop [service]', 'stop named service, or all if no name supplied');
   *
   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
   * @param {(object | string)} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
   * @param {object} [execOpts] - configuration options (for executable)
   * @return {Command} returns new command for action handler, or `this` for executable command
   */

  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    let desc = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === 'object' && desc !== null) {
      opts = desc;
      desc = null;
    }
    opts = opts || {};
    const [, name, args] = nameAndArgs.match(/([^ ]+) *(.*)/);

    const cmd = this.createCommand(name);
    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
    if (args) cmd.arguments(args);
    this._registerCommand(cmd);
    cmd.parent = this;
    cmd.copyInheritedSettings(this);

    if (desc) return this;
    return cmd;
  }

  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */

  createCommand(name) {
    return new command_Command(name);
  }

  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */

  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  }

  /**
   * You can customise the help by overriding Help properties using configureHelp(),
   * or with a subclass of Help by overriding createHelp().
   *
   * @param {object} [configuration] - configuration options
   * @return {(Command | object)} `this` command for chaining, or stored configuration
   */

  configureHelp(configuration) {
    if (configuration === undefined) return this._helpConfiguration;

    this._helpConfiguration = configuration;
    return this;
  }

  /**
   * The default output goes to stdout and stderr. You can customise this for special
   * applications. You can also customise the display of errors by overriding outputError.
   *
   * The configuration properties are all functions:
   *
   *     // change how output being written, defaults to stdout and stderr
   *     writeOut(str)
   *     writeErr(str)
   *     // change how output being written for errors, defaults to writeErr
   *     outputError(str, write) // used for displaying errors and not used for displaying help
   *     // specify width for wrapping help
   *     getOutHelpWidth()
   *     getErrHelpWidth()
   *     // color support, currently only used with Help
   *     getOutHasColors()
   *     getErrHasColors()
   *     stripColor() // used to remove ANSI escape codes if output does not have colors
   *
   * @param {object} [configuration] - configuration options
   * @return {(Command | object)} `this` command for chaining, or stored configuration
   */

  configureOutput(configuration) {
    if (configuration === undefined) return this._outputConfiguration;

    this._outputConfiguration = {
      ...this._outputConfiguration,
      ...configuration,
    };
    return this;
  }

  /**
   * Display the help or a custom message after an error occurs.
   *
   * @param {(boolean|string)} [displayHelp]
   * @return {Command} `this` command for chaining
   */
  showHelpAfterError(displayHelp = true) {
    if (typeof displayHelp !== 'string') displayHelp = !!displayHelp;
    this._showHelpAfterError = displayHelp;
    return this;
  }

  /**
   * Display suggestion of similar commands for unknown commands, or options for unknown options.
   *
   * @param {boolean} [displaySuggestion]
   * @return {Command} `this` command for chaining
   */
  showSuggestionAfterError(displaySuggestion = true) {
    this._showSuggestionAfterError = !!displaySuggestion;
    return this;
  }

  /**
   * Add a prepared subcommand.
   *
   * See .command() for creating an attached subcommand which inherits settings from its parent.
   *
   * @param {Command} cmd - new subcommand
   * @param {object} [opts] - configuration options
   * @return {Command} `this` command for chaining
   */

  addCommand(cmd, opts) {
    if (!cmd._name) {
      throw new Error(`Command passed to .addCommand() must have a name
- specify the name in Command constructor or using .name()`);
    }

    opts = opts || {};
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

    this._registerCommand(cmd);
    cmd.parent = this;
    cmd._checkForBrokenPassThrough();

    return this;
  }

  /**
   * Factory routine to create a new unattached argument.
   *
   * See .argument() for creating an attached argument, which uses this routine to
   * create the argument. You can override createArgument to return a custom argument.
   *
   * @param {string} name
   * @param {string} [description]
   * @return {Argument} new argument
   */

  createArgument(name, description) {
    return new argument_Argument(name, description);
  }

  /**
   * Define argument syntax for command.
   *
   * The default is that the argument is required, and you can explicitly
   * indicate this with <> around the name. Put [] around the name for an optional argument.
   *
   * @example
   * program.argument('<input-file>');
   * program.argument('[output-file]');
   *
   * @param {string} name
   * @param {string} [description]
   * @param {(Function|*)} [parseArg] - custom argument processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */
  argument(name, description, parseArg, defaultValue) {
    const argument = this.createArgument(name, description);
    if (typeof parseArg === 'function') {
      argument.default(defaultValue).argParser(parseArg);
    } else {
      argument.default(parseArg);
    }
    this.addArgument(argument);
    return this;
  }

  /**
   * Define argument syntax for command, adding multiple at once (without descriptions).
   *
   * See also .argument().
   *
   * @example
   * program.arguments('<cmd> [env]');
   *
   * @param {string} names
   * @return {Command} `this` command for chaining
   */

  arguments(names) {
    names
      .trim()
      .split(/ +/)
      .forEach((detail) => {
        this.argument(detail);
      });
    return this;
  }

  /**
   * Define argument syntax for command, adding a prepared argument.
   *
   * @param {Argument} argument
   * @return {Command} `this` command for chaining
   */
  addArgument(argument) {
    const previousArgument = this.registeredArguments.slice(-1)[0];
    if (previousArgument?.variadic) {
      throw new Error(
        `only the last argument can be variadic '${previousArgument.name()}'`,
      );
    }
    if (
      argument.required &&
      argument.defaultValue !== undefined &&
      argument.parseArg === undefined
    ) {
      throw new Error(
        `a default value for a required argument is never used: '${argument.name()}'`,
      );
    }
    this.registeredArguments.push(argument);
    return this;
  }

  /**
   * Customise or override default help command. By default a help command is automatically added if your command has subcommands.
   *
   * @example
   *    program.helpCommand('help [cmd]');
   *    program.helpCommand('help [cmd]', 'show help');
   *    program.helpCommand(false); // suppress default help command
   *    program.helpCommand(true); // add help command even if no subcommands
   *
   * @param {string|boolean} enableOrNameAndArgs - enable with custom name and/or arguments, or boolean to override whether added
   * @param {string} [description] - custom description
   * @return {Command} `this` command for chaining
   */

  helpCommand(enableOrNameAndArgs, description) {
    if (typeof enableOrNameAndArgs === 'boolean') {
      this._addImplicitHelpCommand = enableOrNameAndArgs;
      if (enableOrNameAndArgs && this._defaultCommandGroup) {
        // make the command to store the group
        this._initCommandGroup(this._getHelpCommand());
      }
      return this;
    }

    const nameAndArgs = enableOrNameAndArgs ?? 'help [command]';
    const [, helpName, helpArgs] = nameAndArgs.match(/([^ ]+) *(.*)/);
    const helpDescription = description ?? 'display help for command';

    const helpCommand = this.createCommand(helpName);
    helpCommand.helpOption(false);
    if (helpArgs) helpCommand.arguments(helpArgs);
    if (helpDescription) helpCommand.description(helpDescription);

    this._addImplicitHelpCommand = true;
    this._helpCommand = helpCommand;
    // init group unless lazy create
    if (enableOrNameAndArgs || description) this._initCommandGroup(helpCommand);

    return this;
  }

  /**
   * Add prepared custom help command.
   *
   * @param {(Command|string|boolean)} helpCommand - custom help command, or deprecated enableOrNameAndArgs as for `.helpCommand()`
   * @param {string} [deprecatedDescription] - deprecated custom description used with custom name only
   * @return {Command} `this` command for chaining
   */
  addHelpCommand(helpCommand, deprecatedDescription) {
    // If not passed an object, call through to helpCommand for backwards compatibility,
    // as addHelpCommand was originally used like helpCommand is now.
    if (typeof helpCommand !== 'object') {
      this.helpCommand(helpCommand, deprecatedDescription);
      return this;
    }

    this._addImplicitHelpCommand = true;
    this._helpCommand = helpCommand;
    this._initCommandGroup(helpCommand);
    return this;
  }

  /**
   * Lazy create help command.
   *
   * @return {(Command|null)}
   * @package
   */
  _getHelpCommand() {
    const hasImplicitHelpCommand =
      this._addImplicitHelpCommand ??
      (this.commands.length &&
        !this._actionHandler &&
        !this._findCommand('help'));

    if (hasImplicitHelpCommand) {
      if (this._helpCommand === undefined) {
        this.helpCommand(undefined, undefined); // use default name and description
      }
      return this._helpCommand;
    }
    return null;
  }

  /**
   * Add hook for life cycle event.
   *
   * @param {string} event
   * @param {Function} listener
   * @return {Command} `this` command for chaining
   */

  hook(event, listener) {
    const allowedValues = ['preSubcommand', 'preAction', 'postAction'];
    if (!allowedValues.includes(event)) {
      throw new Error(`Unexpected value for event passed to hook : '${event}'.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    if (this._lifeCycleHooks[event]) {
      this._lifeCycleHooks[event].push(listener);
    } else {
      this._lifeCycleHooks[event] = [listener];
    }
    return this;
  }

  /**
   * Register callback to use as replacement for calling process.exit.
   *
   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
   * @return {Command} `this` command for chaining
   */

  exitOverride(fn) {
    if (fn) {
      this._exitCallback = fn;
    } else {
      this._exitCallback = (err) => {
        if (err.code !== 'commander.executeSubCommandAsync') {
          throw err;
        } else {
          // Async callback from spawn events, not useful to throw.
        }
      };
    }
    return this;
  }

  /**
   * Call process.exit, and _exitCallback if defined.
   *
   * @param {number} exitCode exit code for using with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @return never
   * @private
   */

  _exit(exitCode, code, message) {
    if (this._exitCallback) {
      this._exitCallback(new CommanderError(exitCode, code, message));
      // Expecting this line is not reached.
    }
    external_node_process_namespaceObject.exit(exitCode);
  }

  /**
   * Register callback `fn` for the command.
   *
   * @example
   * program
   *   .command('serve')
   *   .description('start service')
   *   .action(function() {
   *      // do work here
   *   });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   */

  action(fn) {
    const listener = (args) => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = this.registeredArguments.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) {
        actionArgs[expectedArgsCount] = this; // backwards compatible "options"
      } else {
        actionArgs[expectedArgsCount] = this.opts();
      }
      actionArgs.push(this);

      return fn.apply(this, actionArgs);
    };
    this._actionHandler = listener;
    return this;
  }

  /**
   * Factory routine to create a new unattached option.
   *
   * See .option() for creating an attached option, which uses this routine to
   * create the option. You can override createOption to return a custom option.
   *
   * @param {string} flags
   * @param {string} [description]
   * @return {Option} new option
   */

  createOption(flags, description) {
    return new option_Option(flags, description);
  }

  /**
   * Wrap parseArgs to catch 'commander.invalidArgument'.
   *
   * @param {(Option | Argument)} target
   * @param {string} value
   * @param {*} previous
   * @param {string} invalidArgumentMessage
   * @private
   */

  _callParseArg(target, value, previous, invalidArgumentMessage) {
    try {
      return target.parseArg(value, previous);
    } catch (err) {
      if (err.code === 'commander.invalidArgument') {
        const message = `${invalidArgumentMessage} ${err.message}`;
        this.error(message, { exitCode: err.exitCode, code: err.code });
      }
      throw err;
    }
  }

  /**
   * Check for option flag conflicts.
   * Register option if no conflicts found, or throw on conflict.
   *
   * @param {Option} option
   * @private
   */

  _registerOption(option) {
    const matchingOption =
      (option.short && this._findOption(option.short)) ||
      (option.long && this._findOption(option.long));
    if (matchingOption) {
      const matchingFlag =
        option.long && this._findOption(option.long)
          ? option.long
          : option.short;
      throw new Error(`Cannot add option '${option.flags}'${this._name && ` to command '${this._name}'`} due to conflicting flag '${matchingFlag}'
-  already used by option '${matchingOption.flags}'`);
    }

    this._initOptionGroup(option);
    this.options.push(option);
  }

  /**
   * Check for command name and alias conflicts with existing commands.
   * Register command if no conflicts found, or throw on conflict.
   *
   * @param {Command} command
   * @private
   */

  _registerCommand(command) {
    const knownBy = (cmd) => {
      return [cmd.name()].concat(cmd.aliases());
    };

    const alreadyUsed = knownBy(command).find((name) =>
      this._findCommand(name),
    );
    if (alreadyUsed) {
      const existingCmd = knownBy(this._findCommand(alreadyUsed)).join('|');
      const newCmd = knownBy(command).join('|');
      throw new Error(
        `cannot add command '${newCmd}' as already have command '${existingCmd}'`,
      );
    }

    this._initCommandGroup(command);
    this.commands.push(command);
  }

  /**
   * Add an option.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addOption(option) {
    this._registerOption(option);

    const oname = option.name();
    const name = option.attributeName();

    // store default value
    if (option.defaultValue !== undefined) {
      this.setOptionValueWithSource(name, option.defaultValue, 'default');
    }

    // handler for cli and env supplied values
    const handleOptionValue = (val, invalidValueMessage, valueSource) => {
      // val is null for optional option used without an optional-argument.
      // val is undefined for boolean and negated option.
      if (val == null && option.presetArg !== undefined) {
        val = option.presetArg;
      }

      // custom processing
      const oldValue = this.getOptionValue(name);
      if (val !== null && option.parseArg) {
        val = this._callParseArg(option, val, oldValue, invalidValueMessage);
      } else if (val !== null && option.variadic) {
        val = option._collectValue(val, oldValue);
      }

      // Fill-in appropriate missing values. Long winded but easy to follow.
      if (val == null) {
        if (option.negate) {
          val = false;
        } else if (option.isBoolean() || option.optional) {
          val = true;
        } else {
          val = ''; // not normal, parseArg might have failed or be a mock function for testing
        }
      }
      this.setOptionValueWithSource(name, val, valueSource);
    };

    this.on('option:' + oname, (val) => {
      const invalidValueMessage = `error: option '${option.flags}' argument '${val}' is invalid.`;
      handleOptionValue(val, invalidValueMessage, 'cli');
    });

    if (option.envVar) {
      this.on('optionEnv:' + oname, (val) => {
        const invalidValueMessage = `error: option '${option.flags}' value '${val}' from env '${option.envVar}' is invalid.`;
        handleOptionValue(val, invalidValueMessage, 'env');
      });
    }

    return this;
  }

  /**
   * Internal implementation shared by .option() and .requiredOption()
   *
   * @return {Command} `this` command for chaining
   * @private
   */
  _optionEx(config, flags, description, fn, defaultValue) {
    if (typeof flags === 'object' && flags instanceof option_Option) {
      throw new Error(
        'To add an Option object use addOption() instead of option() or requiredOption()',
      );
    }
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === 'function') {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      const regex = fn;
      fn = (val, def) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else {
      option.default(fn);
    }

    return this.addOption(option);
  }

  /**
   * Define option with `flags`, `description`, and optional argument parsing function or `defaultValue` or both.
   *
   * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space. A required
   * option-argument is indicated by `<>` and an optional option-argument by `[]`.
   *
   * See the README for more details, and see also addOption() and requiredOption().
   *
   * @example
   * program
   *     .option('-p, --pepper', 'add pepper')
   *     .option('--pt, --pizza-type <TYPE>', 'type of pizza') // required option-argument
   *     .option('-c, --cheese [CHEESE]', 'add extra cheese', 'mozzarella') // optional option-argument with default
   *     .option('-t, --tip <VALUE>', 'add tip to purchase cost', parseFloat) // custom parse function
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {(Function|*)} [parseArg] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */

  option(flags, description, parseArg, defaultValue) {
    return this._optionEx({}, flags, description, parseArg, defaultValue);
  }

  /**
   * Add a required option which must have a value after parsing. This usually means
   * the option must be specified on the command line. (Otherwise the same as .option().)
   *
   * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {(Function|*)} [parseArg] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */

  requiredOption(flags, description, parseArg, defaultValue) {
    return this._optionEx(
      { mandatory: true },
      flags,
      description,
      parseArg,
      defaultValue,
    );
  }

  /**
   * Alter parsing of short flags with optional values.
   *
   * @example
   * // for `.option('-f,--flag [value]'):
   * program.combineFlagAndOptionalValue(true);  // `-f80` is treated like `--flag=80`, this is the default behaviour
   * program.combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
   *
   * @param {boolean} [combine] - if `true` or omitted, an optional value can be specified directly after the flag.
   * @return {Command} `this` command for chaining
   */
  combineFlagAndOptionalValue(combine = true) {
    this._combineFlagAndOptionalValue = !!combine;
    return this;
  }

  /**
   * Allow unknown options on the command line.
   *
   * @param {boolean} [allowUnknown] - if `true` or omitted, no error will be thrown for unknown options.
   * @return {Command} `this` command for chaining
   */
  allowUnknownOption(allowUnknown = true) {
    this._allowUnknownOption = !!allowUnknown;
    return this;
  }

  /**
   * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
   *
   * @param {boolean} [allowExcess] - if `true` or omitted, no error will be thrown for excess arguments.
   * @return {Command} `this` command for chaining
   */
  allowExcessArguments(allowExcess = true) {
    this._allowExcessArguments = !!allowExcess;
    return this;
  }

  /**
   * Enable positional options. Positional means global options are specified before subcommands which lets
   * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
   * The default behaviour is non-positional and global options may appear anywhere on the command line.
   *
   * @param {boolean} [positional]
   * @return {Command} `this` command for chaining
   */
  enablePositionalOptions(positional = true) {
    this._enablePositionalOptions = !!positional;
    return this;
  }

  /**
   * Pass through options that come after command-arguments rather than treat them as command-options,
   * so actual command-options come before command-arguments. Turning this on for a subcommand requires
   * positional options to have been enabled on the program (parent commands).
   * The default behaviour is non-positional and options may appear before or after command-arguments.
   *
   * @param {boolean} [passThrough] for unknown options.
   * @return {Command} `this` command for chaining
   */
  passThroughOptions(passThrough = true) {
    this._passThroughOptions = !!passThrough;
    this._checkForBrokenPassThrough();
    return this;
  }

  /**
   * @private
   */

  _checkForBrokenPassThrough() {
    if (
      this.parent &&
      this._passThroughOptions &&
      !this.parent._enablePositionalOptions
    ) {
      throw new Error(
        `passThroughOptions cannot be used for '${this._name}' without turning on enablePositionalOptions for parent command(s)`,
      );
    }
  }

  /**
   * Whether to store option values as properties on command object,
   * or store separately (specify false). In both cases the option values can be accessed using .opts().
   *
   * @param {boolean} [storeAsProperties=true]
   * @return {Command} `this` command for chaining
   */

  storeOptionsAsProperties(storeAsProperties = true) {
    if (this.options.length) {
      throw new Error('call .storeOptionsAsProperties() before adding options');
    }
    if (Object.keys(this._optionValues).length) {
      throw new Error(
        'call .storeOptionsAsProperties() before setting option values',
      );
    }
    this._storeOptionsAsProperties = !!storeAsProperties;
    return this;
  }

  /**
   * Retrieve option value.
   *
   * @param {string} key
   * @return {object} value
   */

  getOptionValue(key) {
    if (this._storeOptionsAsProperties) {
      return this[key];
    }
    return this._optionValues[key];
  }

  /**
   * Store option value.
   *
   * @param {string} key
   * @param {object} value
   * @return {Command} `this` command for chaining
   */

  setOptionValue(key, value) {
    return this.setOptionValueWithSource(key, value, undefined);
  }

  /**
   * Store option value and where the value came from.
   *
   * @param {string} key
   * @param {object} value
   * @param {string} source - expected values are default/config/env/cli/implied
   * @return {Command} `this` command for chaining
   */

  setOptionValueWithSource(key, value, source) {
    if (this._storeOptionsAsProperties) {
      this[key] = value;
    } else {
      this._optionValues[key] = value;
    }
    this._optionValueSources[key] = source;
    return this;
  }

  /**
   * Get source of option value.
   * Expected values are default | config | env | cli | implied
   *
   * @param {string} key
   * @return {string}
   */

  getOptionValueSource(key) {
    return this._optionValueSources[key];
  }

  /**
   * Get source of option value. See also .optsWithGlobals().
   * Expected values are default | config | env | cli | implied
   *
   * @param {string} key
   * @return {string}
   */

  getOptionValueSourceWithGlobals(key) {
    // global overwrites local, like optsWithGlobals
    let source;
    this._getCommandAndAncestors().forEach((cmd) => {
      if (cmd.getOptionValueSource(key) !== undefined) {
        source = cmd.getOptionValueSource(key);
      }
    });
    return source;
  }

  /**
   * Get user arguments from implied or explicit arguments.
   * Side-effects: set _scriptPath if args included script. Used for default program name, and subcommand searches.
   *
   * @private
   */

  _prepareUserArgs(argv, parseOptions) {
    if (argv !== undefined && !Array.isArray(argv)) {
      throw new Error('first parameter to parse must be array or undefined');
    }
    parseOptions = parseOptions || {};

    // auto-detect argument conventions if nothing supplied
    if (argv === undefined && parseOptions.from === undefined) {
      if (external_node_process_namespaceObject.versions?.electron) {
        parseOptions.from = 'electron';
      }
      // check node specific options for scenarios where user CLI args follow executable without scriptname
      const execArgv = external_node_process_namespaceObject.execArgv ?? [];
      if (
        execArgv.includes('-e') ||
        execArgv.includes('--eval') ||
        execArgv.includes('-p') ||
        execArgv.includes('--print')
      ) {
        parseOptions.from = 'eval'; // internal usage, not documented
      }
    }

    // default to using process.argv
    if (argv === undefined) {
      argv = external_node_process_namespaceObject.argv;
    }
    this.rawArgs = argv.slice();

    // extract the user args and scriptPath
    let userArgs;
    switch (parseOptions.from) {
      case undefined:
      case 'node':
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case 'electron':
        // @ts-ignore: because defaultApp is an unknown property
        if (external_node_process_namespaceObject.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case 'user':
        userArgs = argv.slice(0);
        break;
      case 'eval':
        userArgs = argv.slice(1);
        break;
      default:
        throw new Error(
          `unexpected parse option { from: '${parseOptions.from}' }`,
        );
    }

    // Find default name for program from arguments.
    if (!this._name && this._scriptPath)
      this.nameFromFilename(this._scriptPath);
    this._name = this._name || 'program';

    return userArgs;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Use parseAsync instead of parse if any of your action handlers are async.
   *
   * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
   *
   * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
   * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
   * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
   * - `'user'`: just user arguments
   *
   * @example
   * program.parse(); // parse process.argv and auto-detect electron and special node flags
   * program.parse(process.argv); // assume argv[0] is app and argv[1] is script
   * program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv] - optional, defaults to process.argv
   * @param {object} [parseOptions] - optionally specify style of options with from: node/user/electron
   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
   * @return {Command} `this` command for chaining
   */

  parse(argv, parseOptions) {
    this._prepareForParse();
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    this._parseCommand([], userArgs);

    return this;
  }

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Call with no parameters to parse `process.argv`. Detects Electron and special node options like `node --eval`. Easy mode!
   *
   * Or call with an array of strings to parse, and optionally where the user arguments start by specifying where the arguments are `from`:
   * - `'node'`: default, `argv[0]` is the application and `argv[1]` is the script being run, with user arguments after that
   * - `'electron'`: `argv[0]` is the application and `argv[1]` varies depending on whether the electron application is packaged
   * - `'user'`: just user arguments
   *
   * @example
   * await program.parseAsync(); // parse process.argv and auto-detect electron and special node flags
   * await program.parseAsync(process.argv); // assume argv[0] is app and argv[1] is script
   * await program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv]
   * @param {object} [parseOptions]
   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
   * @return {Promise}
   */

  async parseAsync(argv, parseOptions) {
    this._prepareForParse();
    const userArgs = this._prepareUserArgs(argv, parseOptions);
    await this._parseCommand([], userArgs);

    return this;
  }

  _prepareForParse() {
    // Save the state the first time, then restore the state before each subsequent parse.
    if (this._savedState === null) {
      // Do the special default of lone negated option to true, now that we have all the options.
      // Filter for negated options that have not been processed already.
      this.options
        .filter(
          (option) =>
            option.negate &&
            option.defaultValue === undefined &&
            this.getOptionValue(option.attributeName()) === undefined,
        )
        .forEach((option) => {
          // check for lone negated option: --no-foo without a --foo option
          const positiveLongFlag = option.long.replace(/^--no-/, '--');
          if (!this._findOption(positiveLongFlag)) {
            this.setOptionValueWithSource(
              option.attributeName(),
              true,
              'default',
            );
          }
        });

      this.saveStateBeforeParse();
    } else {
      this.restoreStateBeforeParse();
    }
  }

  /**
   * Called the first time parse is called to save state and allow a restore before subsequent calls to parse.
   * Not usually called directly, but available for subclasses to save their custom state.
   *
   * This is called in a lazy way. Only commands used in parsing chain will have state saved.
   */
  saveStateBeforeParse() {
    this._savedState = {
      // name is stable if supplied by author, but may be unspecified for root command and deduced during parsing
      _name: this._name,
      // option values before parse have default values (including false for negated options)
      // shallow clones
      _optionValues: { ...this._optionValues },
      _optionValueSources: { ...this._optionValueSources },
    };
  }

  /**
   * Restore state before parse for calls after the first.
   * Not usually called directly, but available for subclasses to save their custom state.
   *
   * This is called in a lazy way. Only commands used in parsing chain will have state restored.
   */
  restoreStateBeforeParse() {
    if (this._storeOptionsAsProperties)
      throw new Error(`Can not call parse again when storeOptionsAsProperties is true.
- either make a new Command for each call to parse, or stop storing options as properties`);

    // clear state from _prepareUserArgs
    this._name = this._savedState._name;
    this._scriptPath = null;
    this.rawArgs = [];
    // clear state from setOptionValueWithSource
    this._optionValues = { ...this._savedState._optionValues };
    this._optionValueSources = { ...this._savedState._optionValueSources };
    // clear state from _parseCommand
    this.args = [];
    // clear state from _processArguments
    this.processedArgs = [];
  }

  /**
   * Throw if expected executable is missing. Add lots of help for author.
   *
   * @param {string} executableFile
   * @param {string} executableDir
   * @param {string} subcommandName
   */
  _checkForMissingExecutable(executableFile, executableDir, subcommandName) {
    if (external_node_fs_namespaceObject.existsSync(executableFile)) return;

    const executableDirMessage = executableDir
      ? `searched for local subcommand relative to directory '${executableDir}'`
      : 'no directory for search for local subcommand, use .executableDir() to supply a custom directory';
    const executableMissing = `'${executableFile}' does not exist
 - if '${subcommandName}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name or path
 - ${executableDirMessage}`;
    throw new Error(executableMissing);
  }

  /**
   * Execute a sub-command executable.
   *
   * @private
   */

  _executeSubCommand(subcommand, args) {
    args = args.slice();
    const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];

    function findFile(baseDir, baseName) {
      // Look for specified file
      const localBin = external_node_path_namespaceObject.resolve(baseDir, baseName);
      if (external_node_fs_namespaceObject.existsSync(localBin)) return localBin;

      // Stop looking if candidate already has an expected extension.
      if (sourceExt.includes(external_node_path_namespaceObject.extname(baseName))) return undefined;

      // Try all the extensions.
      const foundExt = sourceExt.find((ext) =>
        external_node_fs_namespaceObject.existsSync(`${localBin}${ext}`),
      );
      if (foundExt) return `${localBin}${foundExt}`;

      return undefined;
    }

    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();

    // executableFile and executableDir might be full path, or just a name
    let executableFile =
      subcommand._executableFile || `${this._name}-${subcommand._name}`;
    let executableDir = this._executableDir || '';
    if (this._scriptPath) {
      let resolvedScriptPath; // resolve possible symlink for installed npm binary
      try {
        resolvedScriptPath = external_node_fs_namespaceObject.realpathSync(this._scriptPath);
      } catch {
        resolvedScriptPath = this._scriptPath;
      }
      executableDir = external_node_path_namespaceObject.resolve(
        external_node_path_namespaceObject.dirname(resolvedScriptPath),
        executableDir,
      );
    }

    // Look for a local file in preference to a command in PATH.
    if (executableDir) {
      let localFile = findFile(executableDir, executableFile);

      // Legacy search using prefix of script name instead of command name
      if (!localFile && !subcommand._executableFile && this._scriptPath) {
        const legacyName = external_node_path_namespaceObject.basename(
          this._scriptPath,
          external_node_path_namespaceObject.extname(this._scriptPath),
        );
        if (legacyName !== this._name) {
          localFile = findFile(
            executableDir,
            `${legacyName}-${subcommand._name}`,
          );
        }
      }
      executableFile = localFile || executableFile;
    }

    const launchWithNode = sourceExt.includes(external_node_path_namespaceObject.extname(executableFile));

    let proc;
    if (external_node_process_namespaceObject.platform !== 'win32') {
      if (launchWithNode) {
        args.unshift(executableFile);
        // add executable arguments to spawn
        args = incrementNodeInspectorPort(external_node_process_namespaceObject.execArgv).concat(args);

        proc = external_node_child_process_namespaceObject.spawn(external_node_process_namespaceObject.argv[0], args, { stdio: 'inherit' });
      } else {
        proc = external_node_child_process_namespaceObject.spawn(executableFile, args, { stdio: 'inherit' });
      }
    } else {
      this._checkForMissingExecutable(
        executableFile,
        executableDir,
        subcommand._name,
      );
      args.unshift(executableFile);
      // add executable arguments to spawn
      args = incrementNodeInspectorPort(external_node_process_namespaceObject.execArgv).concat(args);
      proc = external_node_child_process_namespaceObject.spawn(external_node_process_namespaceObject.execPath, args, { stdio: 'inherit' });
    }

    if (!proc.killed) {
      // testing mainly to avoid leak warnings during unit tests with mocked spawn
      const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
      signals.forEach((signal) => {
        external_node_process_namespaceObject.on(signal, () => {
          if (proc.killed === false && proc.exitCode === null) {
            // @ts-ignore because signals not typed to known strings
            proc.kill(signal);
          }
        });
      });
    }

    // By default terminate process when spawned process terminates.
    const exitCallback = this._exitCallback;
    proc.on('close', (code) => {
      code = code ?? 1; // code is null if spawned process terminated due to a signal
      if (!exitCallback) {
        external_node_process_namespaceObject.exit(code);
      } else {
        exitCallback(
          new CommanderError(
            code,
            'commander.executeSubCommandAsync',
            '(close)',
          ),
        );
      }
    });
    proc.on('error', (err) => {
      // @ts-ignore: because err.code is an unknown property
      if (err.code === 'ENOENT') {
        this._checkForMissingExecutable(
          executableFile,
          executableDir,
          subcommand._name,
        );
        // @ts-ignore: because err.code is an unknown property
      } else if (err.code === 'EACCES') {
        throw new Error(`'${executableFile}' not executable`);
      }
      if (!exitCallback) {
        external_node_process_namespaceObject.exit(1);
      } else {
        const wrappedError = new CommanderError(
          1,
          'commander.executeSubCommandAsync',
          '(error)',
        );
        wrappedError.nestedError = err;
        exitCallback(wrappedError);
      }
    });

    // Store the reference to the child process
    this.runningCommand = proc;
  }

  /**
   * @private
   */

  _dispatchSubcommand(commandName, operands, unknown) {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });

    subCommand._prepareForParse();
    let promiseChain;
    promiseChain = this._chainOrCallSubCommandHook(
      promiseChain,
      subCommand,
      'preSubcommand',
    );
    promiseChain = this._chainOrCall(promiseChain, () => {
      if (subCommand._executableHandler) {
        this._executeSubCommand(subCommand, operands.concat(unknown));
      } else {
        return subCommand._parseCommand(operands, unknown);
      }
    });
    return promiseChain;
  }

  /**
   * Invoke help directly if possible, or dispatch if necessary.
   * e.g. help foo
   *
   * @private
   */

  _dispatchHelpCommand(subcommandName) {
    if (!subcommandName) {
      this.help();
    }
    const subCommand = this._findCommand(subcommandName);
    if (subCommand && !subCommand._executableHandler) {
      subCommand.help();
    }

    // Fallback to parsing the help flag to invoke the help.
    return this._dispatchSubcommand(
      subcommandName,
      [],
      [this._getHelpOption()?.long ?? this._getHelpOption()?.short ?? '--help'],
    );
  }

  /**
   * Check this.args against expected this.registeredArguments.
   *
   * @private
   */

  _checkNumberOfArguments() {
    // too few
    this.registeredArguments.forEach((arg, i) => {
      if (arg.required && this.args[i] == null) {
        this.missingArgument(arg.name());
      }
    });
    // too many
    if (
      this.registeredArguments.length > 0 &&
      this.registeredArguments[this.registeredArguments.length - 1].variadic
    ) {
      return;
    }
    if (this.args.length > this.registeredArguments.length) {
      this._excessArguments(this.args);
    }
  }

  /**
   * Process this.args using this.registeredArguments and save as this.processedArgs!
   *
   * @private
   */

  _processArguments() {
    const myParseArg = (argument, value, previous) => {
      // Extra processing for nice error message on parsing failure.
      let parsedValue = value;
      if (value !== null && argument.parseArg) {
        const invalidValueMessage = `error: command-argument value '${value}' is invalid for argument '${argument.name()}'.`;
        parsedValue = this._callParseArg(
          argument,
          value,
          previous,
          invalidValueMessage,
        );
      }
      return parsedValue;
    };

    this._checkNumberOfArguments();

    const processedArgs = [];
    this.registeredArguments.forEach((declaredArg, index) => {
      let value = declaredArg.defaultValue;
      if (declaredArg.variadic) {
        // Collect together remaining arguments for passing together as an array.
        if (index < this.args.length) {
          value = this.args.slice(index);
          if (declaredArg.parseArg) {
            value = value.reduce((processed, v) => {
              return myParseArg(declaredArg, v, processed);
            }, declaredArg.defaultValue);
          }
        } else if (value === undefined) {
          value = [];
        }
      } else if (index < this.args.length) {
        value = this.args[index];
        if (declaredArg.parseArg) {
          value = myParseArg(declaredArg, value, declaredArg.defaultValue);
        }
      }
      processedArgs[index] = value;
    });
    this.processedArgs = processedArgs;
  }

  /**
   * Once we have a promise we chain, but call synchronously until then.
   *
   * @param {(Promise|undefined)} promise
   * @param {Function} fn
   * @return {(Promise|undefined)}
   * @private
   */

  _chainOrCall(promise, fn) {
    // thenable
    if (promise?.then && typeof promise.then === 'function') {
      // already have a promise, chain callback
      return promise.then(() => fn());
    }
    // callback might return a promise
    return fn();
  }

  /**
   *
   * @param {(Promise|undefined)} promise
   * @param {string} event
   * @return {(Promise|undefined)}
   * @private
   */

  _chainOrCallHooks(promise, event) {
    let result = promise;
    const hooks = [];
    this._getCommandAndAncestors()
      .reverse()
      .filter((cmd) => cmd._lifeCycleHooks[event] !== undefined)
      .forEach((hookedCommand) => {
        hookedCommand._lifeCycleHooks[event].forEach((callback) => {
          hooks.push({ hookedCommand, callback });
        });
      });
    if (event === 'postAction') {
      hooks.reverse();
    }

    hooks.forEach((hookDetail) => {
      result = this._chainOrCall(result, () => {
        return hookDetail.callback(hookDetail.hookedCommand, this);
      });
    });
    return result;
  }

  /**
   *
   * @param {(Promise|undefined)} promise
   * @param {Command} subCommand
   * @param {string} event
   * @return {(Promise|undefined)}
   * @private
   */

  _chainOrCallSubCommandHook(promise, subCommand, event) {
    let result = promise;
    if (this._lifeCycleHooks[event] !== undefined) {
      this._lifeCycleHooks[event].forEach((hook) => {
        result = this._chainOrCall(result, () => {
          return hook(this, subCommand);
        });
      });
    }
    return result;
  }

  /**
   * Process arguments in context of this command.
   * Returns action result, in case it is a promise.
   *
   * @private
   */

  _parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    this._parseOptionsEnv(); // after cli, so parseArg not called on both cli and env
    this._parseOptionsImplied();
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);

    if (operands && this._findCommand(operands[0])) {
      return this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    }
    if (
      this._getHelpCommand() &&
      operands[0] === this._getHelpCommand().name()
    ) {
      return this._dispatchHelpCommand(operands[1]);
    }
    if (this._defaultCommandName) {
      this._outputHelpIfRequested(unknown); // Run the help for default command from parent rather than passing to default command
      return this._dispatchSubcommand(
        this._defaultCommandName,
        operands,
        unknown,
      );
    }
    if (
      this.commands.length &&
      this.args.length === 0 &&
      !this._actionHandler &&
      !this._defaultCommandName
    ) {
      // probably missing subcommand and no handler, user needs help (and exit)
      this.help({ error: true });
    }

    this._outputHelpIfRequested(parsed.unknown);
    this._checkForMissingMandatoryOptions();
    this._checkForConflictingOptions();

    // We do not always call this check to avoid masking a "better" error, like unknown command.
    const checkForUnknownOptions = () => {
      if (parsed.unknown.length > 0) {
        this.unknownOption(parsed.unknown[0]);
      }
    };

    const commandEvent = `command:${this.name()}`;
    if (this._actionHandler) {
      checkForUnknownOptions();
      this._processArguments();

      let promiseChain;
      promiseChain = this._chainOrCallHooks(promiseChain, 'preAction');
      promiseChain = this._chainOrCall(promiseChain, () =>
        this._actionHandler(this.processedArgs),
      );
      if (this.parent) {
        promiseChain = this._chainOrCall(promiseChain, () => {
          this.parent.emit(commandEvent, operands, unknown); // legacy
        });
      }
      promiseChain = this._chainOrCallHooks(promiseChain, 'postAction');
      return promiseChain;
    }
    if (this.parent?.listenerCount(commandEvent)) {
      checkForUnknownOptions();
      this._processArguments();
      this.parent.emit(commandEvent, operands, unknown); // legacy
    } else if (operands.length) {
      if (this._findCommand('*')) {
        // legacy default command
        return this._dispatchSubcommand('*', operands, unknown);
      }
      if (this.listenerCount('command:*')) {
        // skip option check, emit event for possible misspelling suggestion
        this.emit('command:*', operands, unknown);
      } else if (this.commands.length) {
        this.unknownCommand();
      } else {
        checkForUnknownOptions();
        this._processArguments();
      }
    } else if (this.commands.length) {
      checkForUnknownOptions();
      // This command has subcommands and nothing hooked up at this level, so display help (and exit).
      this.help({ error: true });
    } else {
      checkForUnknownOptions();
      this._processArguments();
      // fall through for caller to handle after calling .parse()
    }
  }

  /**
   * Find matching command.
   *
   * @private
   * @return {Command | undefined}
   */
  _findCommand(name) {
    if (!name) return undefined;
    return this.commands.find(
      (cmd) => cmd._name === name || cmd._aliases.includes(name),
    );
  }

  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @return {Option}
   * @package
   */

  _findOption(arg) {
    return this.options.find((option) => option.is(arg));
  }

  /**
   * Display an error message if a mandatory option does not have a value.
   * Called after checking for help flags in leaf subcommand.
   *
   * @private
   */

  _checkForMissingMandatoryOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    this._getCommandAndAncestors().forEach((cmd) => {
      cmd.options.forEach((anOption) => {
        if (
          anOption.mandatory &&
          cmd.getOptionValue(anOption.attributeName()) === undefined
        ) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    });
  }

  /**
   * Display an error message if conflicting options are used together in this.
   *
   * @private
   */
  _checkForConflictingLocalOptions() {
    const definedNonDefaultOptions = this.options.filter((option) => {
      const optionKey = option.attributeName();
      if (this.getOptionValue(optionKey) === undefined) {
        return false;
      }
      return this.getOptionValueSource(optionKey) !== 'default';
    });

    const optionsWithConflicting = definedNonDefaultOptions.filter(
      (option) => option.conflictsWith.length > 0,
    );

    optionsWithConflicting.forEach((option) => {
      const conflictingAndDefined = definedNonDefaultOptions.find((defined) =>
        option.conflictsWith.includes(defined.attributeName()),
      );
      if (conflictingAndDefined) {
        this._conflictingOption(option, conflictingAndDefined);
      }
    });
  }

  /**
   * Display an error message if conflicting options are used together.
   * Called after checking for help flags in leaf subcommand.
   *
   * @private
   */
  _checkForConflictingOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    this._getCommandAndAncestors().forEach((cmd) => {
      cmd._checkForConflictingLocalOptions();
    });
  }

  /**
   * Parse options from `argv` removing known options,
   * and return argv split into operands and unknown arguments.
   *
   * Side effects: modifies command by storing options. Does not reset state if called again.
   *
   * Examples:
   *
   *     argv => operands, unknown
   *     --known kkk op => [op], []
   *     op --known kkk => [op], []
   *     sub --unknown uuu op => [sub], [--unknown uuu op]
   *     sub -- --unknown uuu op => [sub --unknown uuu op], []
   *
   * @param {string[]} args
   * @return {{operands: string[], unknown: string[]}}
   */

  parseOptions(args) {
    const operands = []; // operands, not options or values
    const unknown = []; // first unknown option and remaining unknown args
    let dest = operands;

    function maybeOption(arg) {
      return arg.length > 1 && arg[0] === '-';
    }

    const negativeNumberArg = (arg) => {
      // return false if not a negative number
      if (!/^-(\d+|\d*\.\d+)(e[+-]?\d+)?$/.test(arg)) return false;
      // negative number is ok unless digit used as an option in command hierarchy
      return !this._getCommandAndAncestors().some((cmd) =>
        cmd.options
          .map((opt) => opt.short)
          .some((short) => /^-\d$/.test(short)),
      );
    };

    // parse options
    let activeVariadicOption = null;
    let activeGroup = null; // working through group of short options, like -abc
    let i = 0;
    while (i < args.length || activeGroup) {
      const arg = activeGroup ?? args[i++];
      activeGroup = null;

      // literal
      if (arg === '--') {
        if (dest === unknown) dest.push(arg);
        dest.push(...args.slice(i));
        break;
      }

      if (
        activeVariadicOption &&
        (!maybeOption(arg) || negativeNumberArg(arg))
      ) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;

      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        // recognised option, call listener to assign value with possible custom processing
        if (option) {
          if (option.required) {
            const value = args[i++];
            if (value === undefined) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            // historical behaviour is optional value is following arg unless an option
            if (
              i < args.length &&
              (!maybeOption(args[i]) || negativeNumberArg(args[i]))
            ) {
              value = args[i++];
            }
            this.emit(`option:${option.name()}`, value);
          } else {
            // boolean flag
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }

      // Look for combo options following single dash, eat first one if known.
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (
            option.required ||
            (option.optional && this._combineFlagAndOptionalValue)
          ) {
            // option with value following in same argument
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            // boolean option
            this.emit(`option:${option.name()}`);
            // remove the processed option and keep processing group
            activeGroup = `-${arg.slice(2)}`;
          }
          continue;
        }
      }

      // Look for known long flag with value, like --foo=bar
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf('=');
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }

      // Not a recognised option by this command.
      // Might be a command-argument, or subcommand option, or unknown option, or help command or option.

      // An unknown option means further arguments also classified as unknown so can be reprocessed by subcommands.
      // A negative number in a leaf command is not an unknown option.
      if (
        dest === operands &&
        maybeOption(arg) &&
        !(this.commands.length === 0 && negativeNumberArg(arg))
      ) {
        dest = unknown;
      }

      // If using positionalOptions, stop processing our options at subcommand.
      if (
        (this._enablePositionalOptions || this._passThroughOptions) &&
        operands.length === 0 &&
        unknown.length === 0
      ) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          unknown.push(...args.slice(i));
          break;
        } else if (
          this._getHelpCommand() &&
          arg === this._getHelpCommand().name()
        ) {
          operands.push(arg, ...args.slice(i));
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg, ...args.slice(i));
          break;
        }
      }

      // If using passThroughOptions, stop processing options at first command-argument.
      if (this._passThroughOptions) {
        dest.push(arg, ...args.slice(i));
        break;
      }

      // add arg
      dest.push(arg);
    }

    return { operands, unknown };
  }

  /**
   * Return an object containing local option values as key-value pairs.
   *
   * @return {object}
   */
  opts() {
    if (this._storeOptionsAsProperties) {
      // Preserve original behaviour so backwards compatible when still using properties
      const result = {};
      const len = this.options.length;

      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        result[key] =
          key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }

    return this._optionValues;
  }

  /**
   * Return an object containing merged local and global option values as key-value pairs.
   *
   * @return {object}
   */
  optsWithGlobals() {
    // globals overwrite locals
    return this._getCommandAndAncestors().reduce(
      (combinedOptions, cmd) => Object.assign(combinedOptions, cmd.opts()),
      {},
    );
  }

  /**
   * Display error message and exit (or call exitOverride).
   *
   * @param {string} message
   * @param {object} [errorOptions]
   * @param {string} [errorOptions.code] - an id string representing the error
   * @param {number} [errorOptions.exitCode] - used with process.exit
   */
  error(message, errorOptions) {
    // output handling
    this._outputConfiguration.outputError(
      `${message}\n`,
      this._outputConfiguration.writeErr,
    );
    if (typeof this._showHelpAfterError === 'string') {
      this._outputConfiguration.writeErr(`${this._showHelpAfterError}\n`);
    } else if (this._showHelpAfterError) {
      this._outputConfiguration.writeErr('\n');
      this.outputHelp({ error: true });
    }

    // exit handling
    const config = errorOptions || {};
    const exitCode = config.exitCode || 1;
    const code = config.code || 'commander.error';
    this._exit(exitCode, code, message);
  }

  /**
   * Apply any option related environment variables, if option does
   * not have a value from cli or client code.
   *
   * @private
   */
  _parseOptionsEnv() {
    this.options.forEach((option) => {
      if (option.envVar && option.envVar in external_node_process_namespaceObject.env) {
        const optionKey = option.attributeName();
        // Priority check. Do not overwrite cli or options from unknown source (client-code).
        if (
          this.getOptionValue(optionKey) === undefined ||
          ['default', 'config', 'env'].includes(
            this.getOptionValueSource(optionKey),
          )
        ) {
          if (option.required || option.optional) {
            // option can take a value
            // keep very simple, optional always takes value
            this.emit(`optionEnv:${option.name()}`, external_node_process_namespaceObject.env[option.envVar]);
          } else {
            // boolean
            // keep very simple, only care that envVar defined and not the value
            this.emit(`optionEnv:${option.name()}`);
          }
        }
      }
    });
  }

  /**
   * Apply any implied option values, if option is undefined or default value.
   *
   * @private
   */
  _parseOptionsImplied() {
    const dualHelper = new DualOptions(this.options);
    const hasCustomOptionValue = (optionKey) => {
      return (
        this.getOptionValue(optionKey) !== undefined &&
        !['default', 'implied'].includes(this.getOptionValueSource(optionKey))
      );
    };
    this.options
      .filter(
        (option) =>
          option.implied !== undefined &&
          hasCustomOptionValue(option.attributeName()) &&
          dualHelper.valueFromOption(
            this.getOptionValue(option.attributeName()),
            option,
          ),
      )
      .forEach((option) => {
        Object.keys(option.implied)
          .filter((impliedKey) => !hasCustomOptionValue(impliedKey))
          .forEach((impliedKey) => {
            this.setOptionValueWithSource(
              impliedKey,
              option.implied[impliedKey],
              'implied',
            );
          });
      });
  }

  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @private
   */

  missingArgument(name) {
    const message = `error: missing required argument '${name}'`;
    this.error(message, { code: 'commander.missingArgument' });
  }

  /**
   * `Option` is missing an argument.
   *
   * @param {Option} option
   * @private
   */

  optionMissingArgument(option) {
    const message = `error: option '${option.flags}' argument missing`;
    this.error(message, { code: 'commander.optionMissingArgument' });
  }

  /**
   * `Option` does not have a value, and is a mandatory option.
   *
   * @param {Option} option
   * @private
   */

  missingMandatoryOptionValue(option) {
    const message = `error: required option '${option.flags}' not specified`;
    this.error(message, { code: 'commander.missingMandatoryOptionValue' });
  }

  /**
   * `Option` conflicts with another option.
   *
   * @param {Option} option
   * @param {Option} conflictingOption
   * @private
   */
  _conflictingOption(option, conflictingOption) {
    // The calling code does not know whether a negated option is the source of the
    // value, so do some work to take an educated guess.
    const findBestOptionFromValue = (option) => {
      const optionKey = option.attributeName();
      const optionValue = this.getOptionValue(optionKey);
      const negativeOption = this.options.find(
        (target) => target.negate && optionKey === target.attributeName(),
      );
      const positiveOption = this.options.find(
        (target) => !target.negate && optionKey === target.attributeName(),
      );
      if (
        negativeOption &&
        ((negativeOption.presetArg === undefined && optionValue === false) ||
          (negativeOption.presetArg !== undefined &&
            optionValue === negativeOption.presetArg))
      ) {
        return negativeOption;
      }
      return positiveOption || option;
    };

    const getErrorMessage = (option) => {
      const bestOption = findBestOptionFromValue(option);
      const optionKey = bestOption.attributeName();
      const source = this.getOptionValueSource(optionKey);
      if (source === 'env') {
        return `environment variable '${bestOption.envVar}'`;
      }
      return `option '${bestOption.flags}'`;
    };

    const message = `error: ${getErrorMessage(option)} cannot be used with ${getErrorMessage(conflictingOption)}`;
    this.error(message, { code: 'commander.conflictingOption' });
  }

  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @private
   */

  unknownOption(flag) {
    if (this._allowUnknownOption) return;
    let suggestion = '';

    if (flag.startsWith('--') && this._showSuggestionAfterError) {
      // Looping to pick up the global options too
      let candidateFlags = [];
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let command = this;
      do {
        const moreFlags = command
          .createHelp()
          .visibleOptions(command)
          .filter((option) => option.long)
          .map((option) => option.long);
        candidateFlags = candidateFlags.concat(moreFlags);
        command = command.parent;
      } while (command && !command._enablePositionalOptions);
      suggestion = suggestSimilar(flag, candidateFlags);
    }

    const message = `error: unknown option '${flag}'${suggestion}`;
    this.error(message, { code: 'commander.unknownOption' });
  }

  /**
   * Excess arguments, more than expected.
   *
   * @param {string[]} receivedArgs
   * @private
   */

  _excessArguments(receivedArgs) {
    if (this._allowExcessArguments) return;

    const expected = this.registeredArguments.length;
    const s = expected === 1 ? '' : 's';
    const received = receivedArgs.length;
    const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
    const details = receivedArgs.join(', ');
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${received}: ${details}.`;
    this.error(message, { code: 'commander.excessArguments' });
  }

  /**
   * Unknown command.
   *
   * @private
   */

  unknownCommand() {
    const unknownName = this.args[0];
    let suggestion = '';

    if (this._showSuggestionAfterError) {
      const candidateNames = [];
      this.createHelp()
        .visibleCommands(this)
        .forEach((command) => {
          candidateNames.push(command.name());
          // just visible alias
          if (command.alias()) candidateNames.push(command.alias());
        });
      suggestion = suggestSimilar(unknownName, candidateNames);
    }

    const message = `error: unknown command '${unknownName}'${suggestion}`;
    this.error(message, { code: 'commander.unknownCommand' });
  }

  /**
   * Get or set the program version.
   *
   * This method auto-registers the "-V, --version" option which will print the version number.
   *
   * You can optionally supply the flags and description to override the defaults.
   *
   * @param {string} [str]
   * @param {string} [flags]
   * @param {string} [description]
   * @return {(this | string | undefined)} `this` command for chaining, or version string if no arguments
   */

  version(str, flags, description) {
    if (str === undefined) return this._version;
    this._version = str;
    flags = flags || '-V, --version';
    description = description || 'output the version number';
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this._registerOption(versionOption);

    this.on('option:' + versionOption.name(), () => {
      this._outputConfiguration.writeOut(`${str}\n`);
      this._exit(0, 'commander.version', str);
    });
    return this;
  }

  /**
   * Set the description.
   *
   * @param {string} [str]
   * @param {object} [argsDescription]
   * @return {(string|Command)}
   */
  description(str, argsDescription) {
    if (str === undefined && argsDescription === undefined)
      return this._description;
    this._description = str;
    if (argsDescription) {
      this._argsDescription = argsDescription;
    }
    return this;
  }

  /**
   * Set the summary. Used when listed as subcommand of parent.
   *
   * @param {string} [str]
   * @return {(string|Command)}
   */
  summary(str) {
    if (str === undefined) return this._summary;
    this._summary = str;
    return this;
  }

  /**
   * Set an alias for the command.
   *
   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
   *
   * @param {string} [alias]
   * @return {(string|Command)}
   */

  alias(alias) {
    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

    /** @type {Command} */
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let command = this;
    if (
      this.commands.length !== 0 &&
      this.commands[this.commands.length - 1]._executableHandler
    ) {
      // assume adding alias for last added executable subcommand, rather than this
      command = this.commands[this.commands.length - 1];
    }

    if (alias === command._name)
      throw new Error("Command alias can't be the same as its name");
    const matchingCommand = this.parent?._findCommand(alias);
    if (matchingCommand) {
      // c.f. _registerCommand
      const existingCmd = [matchingCommand.name()]
        .concat(matchingCommand.aliases())
        .join('|');
      throw new Error(
        `cannot add alias '${alias}' to command '${this.name()}' as already have command '${existingCmd}'`,
      );
    }

    command._aliases.push(alias);
    return this;
  }

  /**
   * Set aliases for the command.
   *
   * Only the first alias is shown in the auto-generated help.
   *
   * @param {string[]} [aliases]
   * @return {(string[]|Command)}
   */

  aliases(aliases) {
    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
    if (aliases === undefined) return this._aliases;

    aliases.forEach((alias) => this.alias(alias));
    return this;
  }

  /**
   * Set / get the command usage `str`.
   *
   * @param {string} [str]
   * @return {(string|Command)}
   */

  usage(str) {
    if (str === undefined) {
      if (this._usage) return this._usage;

      const args = this.registeredArguments.map((arg) => {
        return humanReadableArgName(arg);
      });
      return []
        .concat(
          this.options.length || this._helpOption !== null ? '[options]' : [],
          this.commands.length ? '[command]' : [],
          this.registeredArguments.length ? args : [],
        )
        .join(' ');
    }

    this._usage = str;
    return this;
  }

  /**
   * Get or set the name of the command.
   *
   * @param {string} [str]
   * @return {(string|Command)}
   */

  name(str) {
    if (str === undefined) return this._name;
    this._name = str;
    return this;
  }

  /**
   * Set/get the help group heading for this subcommand in parent command's help.
   *
   * @param {string} [heading]
   * @return {Command | string}
   */

  helpGroup(heading) {
    if (heading === undefined) return this._helpGroupHeading ?? '';
    this._helpGroupHeading = heading;
    return this;
  }

  /**
   * Set/get the default help group heading for subcommands added to this command.
   * (This does not override a group set directly on the subcommand using .helpGroup().)
   *
   * @example
   * program.commandsGroup('Development Commands:);
   * program.command('watch')...
   * program.command('lint')...
   * ...
   *
   * @param {string} [heading]
   * @returns {Command | string}
   */
  commandsGroup(heading) {
    if (heading === undefined) return this._defaultCommandGroup ?? '';
    this._defaultCommandGroup = heading;
    return this;
  }

  /**
   * Set/get the default help group heading for options added to this command.
   * (This does not override a group set directly on the option using .helpGroup().)
   *
   * @example
   * program
   *   .optionsGroup('Development Options:')
   *   .option('-d, --debug', 'output extra debugging')
   *   .option('-p, --profile', 'output profiling information')
   *
   * @param {string} [heading]
   * @returns {Command | string}
   */
  optionsGroup(heading) {
    if (heading === undefined) return this._defaultOptionGroup ?? '';
    this._defaultOptionGroup = heading;
    return this;
  }

  /**
   * @param {Option} option
   * @private
   */
  _initOptionGroup(option) {
    if (this._defaultOptionGroup && !option.helpGroupHeading)
      option.helpGroup(this._defaultOptionGroup);
  }

  /**
   * @param {Command} cmd
   * @private
   */
  _initCommandGroup(cmd) {
    if (this._defaultCommandGroup && !cmd.helpGroup())
      cmd.helpGroup(this._defaultCommandGroup);
  }

  /**
   * Set the name of the command from script filename, such as process.argv[1],
   * or import.meta.filename.
   *
   * (Used internally and public although not documented in README.)
   *
   * @example
   * program.nameFromFilename(import.meta.filename);
   *
   * @param {string} filename
   * @return {Command}
   */

  nameFromFilename(filename) {
    this._name = external_node_path_namespaceObject.basename(filename, external_node_path_namespaceObject.extname(filename));

    return this;
  }

  /**
   * Get or set the directory for searching for executable subcommands of this command.
   *
   * @example
   * program.executableDir(import.meta.dirname);
   * // or
   * program.executableDir('subcommands');
   *
   * @param {string} [path]
   * @return {(string|null|Command)}
   */

  executableDir(path) {
    if (path === undefined) return this._executableDir;
    this._executableDir = path;
    return this;
  }

  /**
   * Return program help documentation.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
   * @return {string}
   */

  helpInformation(contextOptions) {
    const helper = this.createHelp();
    const context = this._getOutputContext(contextOptions);
    helper.prepareContext({
      error: context.error,
      helpWidth: context.helpWidth,
      outputHasColors: context.hasColors,
    });
    const text = helper.formatHelp(this, helper);
    if (context.hasColors) return text;
    return this._outputConfiguration.stripColor(text);
  }

  /**
   * @typedef HelpContext
   * @type {object}
   * @property {boolean} error
   * @property {number} helpWidth
   * @property {boolean} hasColors
   * @property {function} write - includes stripColor if needed
   *
   * @returns {HelpContext}
   * @private
   */

  _getOutputContext(contextOptions) {
    contextOptions = contextOptions || {};
    const error = !!contextOptions.error;
    let baseWrite;
    let hasColors;
    let helpWidth;
    if (error) {
      baseWrite = (str) => this._outputConfiguration.writeErr(str);
      hasColors = this._outputConfiguration.getErrHasColors();
      helpWidth = this._outputConfiguration.getErrHelpWidth();
    } else {
      baseWrite = (str) => this._outputConfiguration.writeOut(str);
      hasColors = this._outputConfiguration.getOutHasColors();
      helpWidth = this._outputConfiguration.getOutHelpWidth();
    }
    const write = (str) => {
      if (!hasColors) str = this._outputConfiguration.stripColor(str);
      return baseWrite(str);
    };
    return { error, write, hasColors, helpWidth };
  }

  /**
   * Output help information for this command.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  outputHelp(contextOptions) {
    let deprecatedCallback;
    if (typeof contextOptions === 'function') {
      deprecatedCallback = contextOptions;
      contextOptions = undefined;
    }

    const outputContext = this._getOutputContext(contextOptions);
    /** @type {HelpTextEventContext} */
    const eventContext = {
      error: outputContext.error,
      write: outputContext.write,
      command: this,
    };

    this._getCommandAndAncestors()
      .reverse()
      .forEach((command) => command.emit('beforeAllHelp', eventContext));
    this.emit('beforeHelp', eventContext);

    let helpInformation = this.helpInformation({ error: outputContext.error });
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (
        typeof helpInformation !== 'string' &&
        !Buffer.isBuffer(helpInformation)
      ) {
        throw new Error('outputHelp callback must return a string or a Buffer');
      }
    }
    outputContext.write(helpInformation);

    if (this._getHelpOption()?.long) {
      this.emit(this._getHelpOption().long); // deprecated
    }
    this.emit('afterHelp', eventContext);
    this._getCommandAndAncestors().forEach((command) =>
      command.emit('afterAllHelp', eventContext),
    );
  }

  /**
   * You can pass in flags and a description to customise the built-in help option.
   * Pass in false to disable the built-in help option.
   *
   * @example
   * program.helpOption('-?, --help' 'show help'); // customise
   * program.helpOption(false); // disable
   *
   * @param {(string | boolean)} flags
   * @param {string} [description]
   * @return {Command} `this` command for chaining
   */

  helpOption(flags, description) {
    // Support enabling/disabling built-in help option.
    if (typeof flags === 'boolean') {
      if (flags) {
        if (this._helpOption === null) this._helpOption = undefined; // reenable
        if (this._defaultOptionGroup) {
          // make the option to store the group
          this._initOptionGroup(this._getHelpOption());
        }
      } else {
        this._helpOption = null; // disable
      }
      return this;
    }

    // Customise flags and description.
    this._helpOption = this.createOption(
      flags ?? '-h, --help',
      description ?? 'display help for command',
    );
    // init group unless lazy create
    if (flags || description) this._initOptionGroup(this._helpOption);

    return this;
  }

  /**
   * Lazy create help option.
   * Returns null if has been disabled with .helpOption(false).
   *
   * @returns {(Option | null)} the help option
   * @package
   */
  _getHelpOption() {
    // Lazy create help option on demand.
    if (this._helpOption === undefined) {
      this.helpOption(undefined, undefined);
    }
    return this._helpOption;
  }

  /**
   * Supply your own option to use for the built-in help option.
   * This is an alternative to using helpOption() to customise the flags and description etc.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addHelpOption(option) {
    this._helpOption = option;
    this._initOptionGroup(option);
    return this;
  }

  /**
   * Output help information and exit.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  help(contextOptions) {
    this.outputHelp(contextOptions);
    let exitCode = Number(external_node_process_namespaceObject.exitCode ?? 0); // process.exitCode does allow a string or an integer, but we prefer just a number
    if (
      exitCode === 0 &&
      contextOptions &&
      typeof contextOptions !== 'function' &&
      contextOptions.error
    ) {
      exitCode = 1;
    }
    // message: do not have all displayed text available so only passing placeholder.
    this._exit(exitCode, 'commander.help', '(outputHelp)');
  }

  /**
   * // Do a little typing to coordinate emit and listener for the help text events.
   * @typedef HelpTextEventContext
   * @type {object}
   * @property {boolean} error
   * @property {Command} command
   * @property {function} write
   */

  /**
   * Add additional text to be displayed with the built-in help.
   *
   * Position is 'before' or 'after' to affect just this command,
   * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
   *
   * @param {string} position - before or after built-in help
   * @param {(string | Function)} text - string to add, or a function returning a string
   * @return {Command} `this` command for chaining
   */

  addHelpText(position, text) {
    const allowedValues = ['beforeAll', 'before', 'after', 'afterAll'];
    if (!allowedValues.includes(position)) {
      throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
    }

    const helpEvent = `${position}Help`;
    this.on(helpEvent, (/** @type {HelpTextEventContext} */ context) => {
      let helpStr;
      if (typeof text === 'function') {
        helpStr = text({ error: context.error, command: context.command });
      } else {
        helpStr = text;
      }
      // Ignore falsy value when nothing to output.
      if (helpStr) {
        context.write(`${helpStr}\n`);
      }
    });
    return this;
  }

  /**
   * Output help information if help flags specified
   *
   * @param {Array} args - array of options to search for help flags
   * @private
   */

  _outputHelpIfRequested(args) {
    const helpOption = this._getHelpOption();
    const helpRequested = helpOption && args.find((arg) => helpOption.is(arg));
    if (helpRequested) {
      this.outputHelp();
      // (Do not have all displayed text available so only passing placeholder.)
      this._exit(0, 'commander.helpDisplayed', '(outputHelp)');
    }
  }
}

/**
 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
 *
 * @param {string[]} args - array of arguments from node.execArgv
 * @returns {string[]}
 * @private
 */

function incrementNodeInspectorPort(args) {
  // Testing for these options:
  //  --inspect[=[host:]port]
  //  --inspect-brk[=[host:]port]
  //  --inspect-port=[host:]port
  return args.map((arg) => {
    if (!arg.startsWith('--inspect')) {
      return arg;
    }
    let debugOption;
    let debugHost = '127.0.0.1';
    let debugPort = '9229';
    let match;
    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
      // e.g. --inspect
      debugOption = match[1];
    } else if (
      (match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null
    ) {
      debugOption = match[1];
      if (/^\d+$/.test(match[3])) {
        // e.g. --inspect=1234
        debugPort = match[3];
      } else {
        // e.g. --inspect=localhost
        debugHost = match[3];
      }
    } else if (
      (match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null
    ) {
      // e.g. --inspect=localhost:1234
      debugOption = match[1];
      debugHost = match[3];
      debugPort = match[4];
    }

    if (debugOption && debugPort !== '0') {
      return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
    }
    return arg;
  });
}

/**
 * Exported for using from tests, not otherwise used outside this file.
 *
 * @returns {boolean | undefined}
 * @package
 */
function useColor() {
  // Test for common conventions.
  // NB: the observed behaviour is in combination with how author adds color! For example:
  //   - we do not test NODE_DISABLE_COLORS, but util:styletext does
  //   - we do test NO_COLOR, but Chalk does not
  //
  // References:
  // https://no-color.org
  // https://bixense.com/clicolors/
  // https://github.com/nodejs/node/blob/0a00217a5f67ef4a22384cfc80eb6dd9a917fdc1/lib/internal/tty.js#L109
  // https://github.com/chalk/supports-color/blob/c214314a14bcb174b12b3014b2b0a8de375029ae/index.js#L33
  // (https://force-color.org recent web page from 2023, does not match major javascript implementations)

  if (
    external_node_process_namespaceObject.env.NO_COLOR ||
    external_node_process_namespaceObject.env.FORCE_COLOR === '0' ||
    external_node_process_namespaceObject.env.FORCE_COLOR === 'false'
  )
    return false;
  if (external_node_process_namespaceObject.env.FORCE_COLOR || external_node_process_namespaceObject.env.CLICOLOR_FORCE !== undefined)
    return true;
  return undefined;
}

;// CONCATENATED MODULE: ./node_modules/commander/index.js






const program = new command_Command();

const createCommand = (name) => new Command(name);
const createOption = (flags, description) =>
  new Option(flags, description);
const createArgument = (name, description) =>
  new Argument(name, description);

/**
 * Expose classes
 */



 // Deprecated

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/error.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
function getLineColFromPtr(string, ptr) {
    let lines = string.slice(0, ptr).split(/\r?\n/);
    return [lines.length, lines.pop().length + 1];
}
function makeCodeBlock(string, line, column) {
    let lines = string.split(/\r?\n/);
    let codeblock = '';
    let numberLen = (Math.log10(line + 1) | 0) + 1;
    for (let i = line - 1; i <= line + 1; i++) {
        let l = lines[i - 1];
        if (!l)
            continue;
        codeblock += i.toString().padEnd(numberLen, ' ');
        codeblock += ':  ';
        codeblock += l;
        codeblock += '\n';
        if (i === line) {
            codeblock += ' '.repeat(numberLen + column + 2);
            codeblock += '^\n';
        }
    }
    return codeblock;
}
class TomlError extends Error {
    line;
    column;
    codeblock;
    constructor(message, options) {
        const [line, column] = getLineColFromPtr(options.toml, options.ptr);
        const codeblock = makeCodeBlock(options.toml, line, column);
        super(`Invalid TOML document: ${message}\n\n${codeblock}`, options);
        this.line = line;
        this.column = column;
        this.codeblock = codeblock;
    }
    /** @internal */
    static x(message, ctx, ptr) {
        throw new TomlError(message, { toml: ctx.s, ptr: ptr ?? ctx.p });
    }
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/primitive.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/** @internal */
function parseString(ctx) {
    let startPtr = ctx.p;
    let c = ctx.s.charCodeAt(ctx.p++);
    let first = c;
    let isLiteral = c === 0x27; /* ' */
    let isMultiline = c === ctx.s.charCodeAt(ctx.p) && c === ctx.s.charCodeAt(ctx.p + 1);
    if (isMultiline) {
        // Trim initial newline
        if ((c = ctx.s.charCodeAt(ctx.p += 2)) === 0xa /* \n */)
            ctx.p++;
        else if (c === 0xd /* \r */ && ctx.s.charCodeAt(ctx.p + 1) === 0xa /* \n */)
            ctx.p += 2;
    }
    // For the record: it is not worth it to use a fast-path for literal strings using `indexOf`.
    // Doing a char-by-char iteration ends up dispatching less instructions, for the same wall-clock runtime.
    let parsed = '';
    let sliceStart = ctx.p;
    // states:
    //   0 - decoding
    //   1 - decoding escape
    //   2 - whitespace escape (no newline encountered yet, must fail on non-whitespace)
    //   3 - whitespace escape (newline encountered, allowed to transition back to normal decode)
    let state = 0;
    for (; ctx.p < ctx.s.length; ctx.p++) {
        c = ctx.s.charCodeAt(ctx.p);
        // Deal with newlines first, since that simplifies control character checking and handling across all states
        if (isMultiline && (c === 0xa /* \n */ || (c === 0xd /* \r */ && ctx.s.charCodeAt(ctx.p + 1) === 0xa /* \n */))) {
            state = state && 3;
        }
        // Control characters are banned in TOML, so we throw an error if we encounter them
        else if ((c < 0x20 && c !== 0x9 /* \t */) || c === 0x7f) {
            TomlError.x('control characters are not allowed in strings', ctx);
        }
        // The string might terminate while we're parsing through a newline escape.
        // It must have encountered a newline; otherwise, it'll simply fail in another branch.
        else if ((!state || state === 3) && c === first && (!isMultiline || (ctx.s.charCodeAt(ctx.p + 1) === first && ctx.s.charCodeAt(ctx.p + 2) === first))) {
            if (isMultiline) {
                // If the string ends with 4-5 quotes, then the first 1-2 are part of the string
                if (ctx.s.charCodeAt(ctx.p + 3) === first)
                    ctx.p++;
                if (ctx.s.charCodeAt(ctx.p + 3) === first)
                    ctx.p++;
            }
            // If we're in a newline escape still, then there's nothing to add.
            if (!state) {
                // Avoid a useless concat operation if the string can be used as-is.
                let s = ctx.s.slice(sliceStart, ctx.p);
                parsed = parsed ? parsed + s : s;
            }
            ctx.p += isMultiline ? 3 : 1;
            return parsed;
        }
        // Baseline state; keep moving forward unless an escape sequence starts
        else if (!state) {
            if (!isLiteral && c === 0x5c /* \ */) {
                parsed += ctx.s.slice(sliceStart, (sliceStart = ctx.p));
                state = 1;
            }
        }
        else if (state === 1) {
            if (c === 0x78 /* x */ || c === 0x75 /* u */ || c === 0x55 /* U */) { // Unicode escape
                let errPtr = ctx.p++ - 1;
                let value = 0;
                let len = c === 0x78 /* x */ ? 2 : c === 0x75 /* u */ ? 4 : 8;
                for (let j = 0; j < len; j++, ctx.p++) {
                    let hex = ctx.s.charCodeAt(ctx.p);
                    let digit = 
                    /* 0-9 */ hex >= 0x30 && hex <= 0x39 ? hex - 0x30 :
                        /* A-F */ hex >= 0x41 && hex <= 0x46 ? hex - 0x41 + 10 :
                            /* a-f */ hex >= 0x61 && hex <= 0x66 ? hex - 0x61 + 10 : -1;
                    if (digit < 0)
                        TomlError.x('invalid non-hex character in unicode escape', ctx);
                    value = (value << 4) | digit;
                }
                // Because JS does bitwise on signed 32bit integers, all 0xfzzzzzzz values are actually seen as negative
                if (value < 0 || value > 0x10ffff || (value >= 0xd800 && value <= 0xdfff)) {
                    TomlError.x('invalid unicode escape', ctx, errPtr);
                }
                parsed += String.fromCodePoint(value);
                sliceStart = ctx.p--;
                state = 0;
            }
            // Newline escape sequence. We only need to care about spaces and tabs; newlines are dealt with earlier
            else if (isMultiline && (c === 0x20 || c === 0x9 /* \t */)) {
                state = 2;
            }
            // Basic escape sequence
            else {
                if (c === 0x62 /* b */)
                    parsed += '\b';
                else if (c === 0x74 /* t */)
                    parsed += '\t';
                else if (c === 0x6e /* n */)
                    parsed += '\n';
                else if (c === 0x66 /* f */)
                    parsed += '\f';
                else if (c === 0x72 /* r */)
                    parsed += '\r';
                else if (c === 0x65 /* e */)
                    parsed += '\x1b';
                else if (c === 0x22 /* " */)
                    parsed += '"';
                else if (c === 0x5c /* \ */)
                    parsed += '\\';
                else
                    TomlError.x('unrecognised escape sequence', ctx);
                sliceStart = ctx.p + 1;
                state = 0;
            }
        }
        // Newline escape continuation: keep moving forward until the first non-whitespace char
        else if (c !== 0x20 && c !== 0x9 /* \t */) {
            if (state === 2)
                TomlError.x('invalid escape: only line-ending whitespace may be escaped', ctx, sliceStart);
            // State cannot be zero, or we'd have branched earlier already.
            // If it's a backslash, immediately transition to the escape state so it can be processed.
            state = !isLiteral && c === 0x5c /* \ */ ? 1 : 0;
            sliceStart = ctx.p;
        }
    }
    TomlError.x('unfinished string', ctx, startPtr);
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/date.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
let DATE_TIME_RE = /^(\d{4}-\d{2}-\d{2})?[Tt ]?(?:(\d{2}):\d{2}(?::\d{2}(?:\.\d+)?)?)?(Z|z|[-+]\d{2}:\d{2})?$/i;
class TomlDate extends Date {
    #hasDate = false;
    #hasTime = false;
    #offset = null;
    constructor(date, fasttype, unsafeDelim) {
        let hasDate = true;
        let hasTime = true;
        let offset = 'Z';
        let c;
        if (typeof date === 'string') {
            if (fasttype)
                prep: {
                    // Date-time
                    if (fasttype < 3) {
                        if (+date.slice(11, 13) > 23) {
                            date = '';
                            break prep;
                        }
                        // Local
                        if (fasttype === 2) {
                            offset = null;
                            date += 'Z';
                        }
                        // Offset; keep track of offset if not Z
                        else if ((c = date.charCodeAt(date.length - 1)) !== 0x5a /* Z */ && c !== 0x7a /* z */) {
                            offset = date.slice(date.length - 6);
                        }
                        if (unsafeDelim)
                            date = date.slice(0, 10) + 'T' + date.slice(11);
                    }
                    // Time
                    else if (fasttype === 4) {
                        date = +date.slice(0, 2) > 23 ? '' : `0000-01-01T${date}Z`;
                    }
                    hasDate = fasttype !== 4;
                    hasTime = fasttype !== 3;
                }
            else {
                let match = date.match(DATE_TIME_RE);
                if (match) {
                    if (!match[1]) {
                        hasDate = false;
                        date = `0000-01-01T${date}`;
                    }
                    hasTime = !!match[2];
                    // Make sure to use T instead of a space. Breaks in case of extreme values otherwise.
                    hasTime && date[10] === ' ' && (date = date.replace(' ', 'T'));
                    // Do not allow rollover hours.
                    if (match[2] && +match[2] > 23) {
                        date = '';
                    }
                    else {
                        offset = match[3] || null;
                        if (!offset && hasTime)
                            date += 'Z';
                    }
                }
                else {
                    date = '';
                }
            }
        }
        super(date);
        if (!isNaN(this.getTime())) {
            this.#hasDate = hasDate;
            this.#hasTime = hasTime;
            this.#offset = offset;
        }
    }
    isDateTime() {
        return this.#hasDate && this.#hasTime;
    }
    isLocal() {
        return !this.#hasDate || !this.#hasTime || !this.#offset;
    }
    isDate() {
        return this.#hasDate && !this.#hasTime;
    }
    isTime() {
        return this.#hasTime && !this.#hasDate;
    }
    isValid() {
        return this.#hasDate || this.#hasTime;
    }
    toISOString() {
        let iso = super.toISOString();
        // Local Date
        if (this.isDate())
            return iso.slice(0, 10);
        // Local Time
        if (this.isTime())
            return iso.slice(11, 23);
        // Local DateTime
        if (this.#offset === null)
            return iso.slice(0, -1);
        // Offset DateTime
        if (this.#offset === 'Z' || this.#offset === 'z')
            return iso;
        // This part is quite annoying: JS strips the original timezone from the ISO string representation
        // Instead of using a "modified" date and "Z", we restore the representation "as authored"
        let offset = (+(this.#offset.slice(1, 3)) * 60) + +(this.#offset.slice(4, 6));
        offset = this.#offset[0] === '-' ? offset : -offset;
        let offsetDate = new Date(this.getTime() - (offset * 60e3));
        return offsetDate.toISOString().slice(0, -1) + this.#offset;
    }
    static wrapAsOffsetDateTime(jsDate, offset = 'Z') {
        let date = new TomlDate(jsDate);
        date.#offset = offset;
        return date;
    }
    static wrapAsLocalDateTime(jsDate) {
        let date = new TomlDate(jsDate);
        date.#offset = null;
        return date;
    }
    static wrapAsLocalDate(jsDate) {
        let date = new TomlDate(jsDate);
        date.#hasTime = false;
        date.#offset = null;
        return date;
    }
    static wrapAsLocalTime(jsDate) {
        let date = new TomlDate(jsDate);
        date.#hasDate = false;
        date.#offset = null;
        return date;
    }
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/extract.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */




function isDigit(char, base = 10) {
    return base === 16
        ? (char > 0x2f && char < 0x3a) || (char > 0x40 && char < 0x47) || (char > 0x60 && char < 0x67)
        : (char > 0x2f && char < 0x30 + base);
}
function isEndOfValue(char, delim) {
    // Whitespace -- we're permissive on `\r` for performance; it'll be dealt with later anyway
    return char === 0x20 || char === 0x9 /* \t */ || char === 0xa /* \n */ || char === 0xd /* \r */ ||
        // Structure end or next value delimiter
        (delim && (char === delim || char === 0x2c /* , */)) ||
        // Comment
        char === 0x23; /* # */
}
/** @internal */
function extractValue(ctx, end) {
    let errPtr = ctx.p;
    let c = ctx.s.charCodeAt(ctx.p);
    // Structs
    if (c === 0x5b /* [ */ || c === 0x7b /* { */) {
        ctx.d-- || TomlError.x('document contains excessively nested structures. aborting.', ctx);
        let value = c === 0x5b /* [ */
            ? parseArray(ctx)
            : parseInlineTable(ctx);
        ctx.d++;
        return value;
    }
    // Strings
    if (c === 0x22 /* " */ || c === 0x27 /* ' */) {
        return parseString(ctx);
    }
    // Booleans
    // We can fast-path because the first character is enough to know the only possible value
    if (c === 0x74 /* t */) { // Only possible valid value is `true`
        if (ctx.s.charCodeAt(++ctx.p) !== 0x72 || ctx.s.charCodeAt(++ctx.p) !== 0x75 || ctx.s.charCodeAt(++ctx.p) !== 0x65)
            TomlError.x('invalid value', ctx, errPtr);
        return ctx.p++, true;
    }
    if (c === 0x66 /* f */) { // Only possible valid value is `false`
        if (ctx.s.charCodeAt(++ctx.p) !== 0x61 || ctx.s.charCodeAt(++ctx.p) !== 0x6c || ctx.s.charCodeAt(++ctx.p) !== 0x73 || ctx.s.charCodeAt(++ctx.p) !== 0x65)
            TomlError.x('invalid value', ctx, errPtr);
        return ctx.p++, false;
    }
    if (c === 0x2b /* + */ || c === 0x2d /* - */) {
        return parseNumber(ctx, ctx.p, ctx.s.charCodeAt(++ctx.p), 0x2c - c, end);
    }
    // Rough heuristic, but `parseDate` falls back to number parsing if it's a false positive.
    // e.g.: `a = 1\n-------------- = 1` would match this heuristic, but gracefully fallback to numbers.
    if (ctx.s.charCodeAt(ctx.p + 4) === 0x2d /* - */ && ctx.s.charCodeAt(ctx.p + 7) === 0x2d /* - */) {
        return parseDate(ctx, c, end);
    }
    // Same logic as above; `parseTime` falls back to number parsing if it's a false positive.
    if (ctx.s.charCodeAt(ctx.p + 2) === 0x3a /* : */) {
        return parseTime(ctx, c, end);
    }
    return parseNumber(ctx, ctx.p, c, 0, end);
}
// State:
// 0: init
// 1: integer
// 2: fractional dot
// 3: fractional
// 4: exponent letter
// 5: exponent
// 6: exponent sign
// 7: exponent with sign
// >9: underscore; see below
//     -> 12: was integer
//     -> 14: was fractional
//     -> 16: was exponent
// states 2-5, 14, 16 are ONLY permitted iif base === 10
function parseNumber(ctx, startPtr, startChr, sign, endChr) {
    let c = startChr;
    let state = 0;
    let hasUnderscores = false;
    // (+/-)inf
    if (c === 0x69 /* i */) {
        if (ctx.s.charCodeAt(++ctx.p) !== 0x6e || ctx.s.charCodeAt(++ctx.p) !== 0x66)
            TomlError.x('invalid value', ctx, startPtr);
        return ctx.p++, (sign || 1) / 0;
    }
    // (+/-)nan
    if (c === 0x6e /* n */) {
        if (ctx.s.charCodeAt(++ctx.p) !== 0x61 || ctx.s.charCodeAt(++ctx.p) !== 0x6e)
            TomlError.x('invalid value', ctx, startPtr);
        return ctx.p++, NaN;
    }
    // Leading zero
    // Only allowed cases: `0<EOV>`, `0.(...)`, `0e(...)`, `0x(...)`, `0b(...)`, `0o(...)`
    // FWIW, `0e(...)` is a stupid case, but it's not banned per-se so we have to parse it
    if (c === 0x30 /* 0 */) {
        if (++ctx.p >= ctx.s.length || isEndOfValue(c = ctx.s.charCodeAt(ctx.p), endChr))
            return ctx.bi === true ? 0n : 0; // note: conveniently deals with `-0`
        if (!sign) {
            if (c === 0x78 /* x */)
                return parseIntegerBaseN(ctx, startPtr, 16, endChr);
            else if (c === 0x62 /* b */)
                return parseIntegerBaseN(ctx, startPtr, 2, endChr);
            else if (c === 0x6f /* o */)
                return parseIntegerBaseN(ctx, startPtr, 8, endChr);
        }
        if (c === 0x2e /* . */)
            state = 2;
        else if (c === 0x65 /* e */ || c === 0x45 /* E */)
            state = 4;
        else
            TomlError.x('illegal leading zero', ctx, startPtr);
    }
    // If the 1st char is not a digit by now, then it's not a valid TOML value at all
    else if (!isDigit(c))
        TomlError.x('invalid value', ctx, startPtr);
    while (++ctx.p < ctx.s.length && (c = ctx.s.charCodeAt(ctx.p), !isEndOfValue(c, endChr))) {
        if (!state)
            state = 1; // Detects single-digit numbers we can use a fast parse path for
        // The way the states are numbered is not random: underscores are always permitted in odd-numbered states and
        // never permitted in even-numbered ones.
        if (c === 0x5f /* _ */) {
            if (!(state & 1))
                TomlError.x('illegal underscore', ctx);
            state += 11; // 11 is a marker that makes the state even and greater than 9; see the numbering + rationale above
            hasUnderscores = true;
        }
        // Transition to fractional part.
        else if (state === 1 && c === 0x2e /* . */)
            state = 2;
        // Transition to exponent part.
        else if ((state === 1 || state === 3) && (c === 0x65 /* e */ || c === 0x45 /* E */))
            state = 4;
        // + and - are permitted in state 4 only (handled before entering the function for state 0)
        else if (state === 4 && (c === 0x2b /* + */ || c === 0x2d /* - */)) {
            state = 6;
        }
        // All special cases have been handled; only digits are allowed here
        else if (!isDigit(c))
            TomlError.x(`illegal character in numeric literal`, ctx);
        // Clear state flags
        else if (state > 9)
            state -= 11;
        else if (!(state & 1))
            state++;
    }
    // Single-char number; we can fast-path these very easily.
    if (!state) {
        let val = (startChr - 0x30 /* 0 */) * (sign || 1);
        return ctx.bi === true ? BigInt(val) : val;
    }
    // Even-numbered states absolutely require a digit next; not even end of value is permitted
    if (!(state & 1))
        TomlError.x('unfinished numeric value', ctx, startPtr);
    let str = ctx.s.slice(startPtr, ctx.p);
    if (hasUnderscores)
        str = str.replaceAll('_', ''); // perf: replaceAll 1.25x faster than replace with a regex
    return state > 1
        ? parseFloat(str)
        : parseInteger(ctx, str, 10, startPtr);
}
function parseIntegerBaseN(ctx, startPtr, base, endChr) {
    let c, underscore = 1;
    while (++ctx.p < ctx.s.length && (c = ctx.s.charCodeAt(ctx.p), !isEndOfValue(c, endChr))) {
        if (c === 0x5f /* _ */) {
            if (underscore & 1)
                TomlError.x('illegal underscore', ctx);
            underscore = 3;
        }
        // We only need to check if the number is a valid digit, nothing else is permitted
        else if (!isDigit(c, base))
            TomlError.x(`illegal character in numeric literal`, ctx);
        // Clear underscore flag
        else if (underscore & 1)
            underscore--;
    }
    // Trailing underscore is not allowed
    if (underscore & 1)
        TomlError.x('unfinished numeric value', ctx);
    let str = ctx.s.slice(startPtr + 2, ctx.p);
    if (underscore)
        str = str.replaceAll('_', ''); // perf: replaceAll 1.25x faster than replace with a regex
    return parseInteger(ctx, str, base, startPtr);
}
function parseInteger(ctx, str, base, startPtr) {
    if (ctx.bi !== true)
        int: {
            let val = parseInt(str, base);
            if (!Number.isSafeInteger(val)) {
                if (ctx.bi)
                    break int;
                TomlError.x('integer value cannot be represented losslessly', ctx, startPtr);
            }
            return val;
        }
    return base === 10 ? BigInt(str) : BigInt((base === 2 ? '0b' : base === 8 ? '0o' : '0x') + str);
}
function parseDate(ctx, c, endChr) {
    let startPtr = ctx.p++, unsafeSeparator;
    if (!isDigit(c) ||
        !isDigit(ctx.s.charCodeAt(ctx.p++)) ||
        !isDigit(ctx.s.charCodeAt(ctx.p++)) ||
        !isDigit(ctx.s.charCodeAt(ctx.p++))) {
        return parseNumber(ctx, ctx.p = startPtr, c, 0, endChr);
    }
    ctx.p += 5;
    if (!isDigit(ctx.s.charCodeAt(ctx.p++)))
        TomlError.x('invalid date-time: date part is malformed', ctx, startPtr);
    if (ctx.p >= ctx.s.length || (((c = ctx.s.charCodeAt(ctx.p)) !== 0x20 || (unsafeSeparator = true, !isDigit(ctx.s.charCodeAt(ctx.p + 1)))) && c !== 0x54 /* T */ && c !== 0x74 /* t */)) {
        let t = ctx.s.slice(startPtr, ctx.p);
        return readDate(ctx, t, 3, false, startPtr);
    }
    if (ctx.s.charCodeAt(ctx.p += 3) !== 0x3a /* : */)
        TomlError.x('invalid date-time: time part is malformed', ctx, startPtr);
    if (ctx.s.charCodeAt(ctx.p += 3) === 0x3a /* : */)
        ctx.p += 3;
    if (ctx.s.charCodeAt(ctx.p) === 0x2e /* . */)
        while (isDigit(ctx.s.charCodeAt(++ctx.p)))
            ;
    if (c = ctx.s.charCodeAt(ctx.p)) {
        if (c === 0x5a /* Z */ || c === 0x7a /* z */) {
            let t = ctx.s.slice(startPtr, ++ctx.p);
            return readDate(ctx, t, 1, unsafeSeparator, startPtr, '[+00:00]');
        }
        if (c === 0x2b /* + */ || c === 0x2d /* - */) {
            // Temporal's ZonedDateTime is weird asf when it comes to dealing with traditional offsets...
            // It's 1.2x faster to allocate a new string to pass to ZDT than use Instant.toZonedDateTimeISO
            let t = ctx.s.slice(startPtr, ctx.p += 6);
            return readDate(ctx, t, 1, unsafeSeparator, startPtr, !ctx.ld && ('[' + ctx.s.slice(ctx.p - 6, ctx.p) + ']'));
        }
    }
    let t = ctx.s.slice(startPtr, ctx.p);
    return readDate(ctx, t, 2, unsafeSeparator, startPtr);
}
function parseTime(ctx, c, endChr) {
    let start = ctx.p;
    if (!isDigit(c) || !isDigit(ctx.s.charCodeAt(++ctx.p))) {
        return parseNumber(ctx, --ctx.p, c, 0, endChr);
    }
    if (ctx.s.charCodeAt(ctx.p += 4) === 0x3a /* : */)
        ctx.p += 3;
    if (ctx.s.charCodeAt(ctx.p) === 0x2e /* . */)
        while (isDigit(ctx.s.charCodeAt(++ctx.p)))
            ;
    let t = ctx.s.slice(start, ctx.p);
    return readDate(ctx, t, 4, false, start);
}
function readDate(ctx, str, type, unsafeDelim, errPtr, temporalSuffix) {
    if (ctx.ld) {
        let date = new TomlDate(str, type, unsafeDelim);
        if (!date.isValid())
            TomlError.x('invalid date', ctx, errPtr);
        return date;
    }
    try {
        if (temporalSuffix)
            str += temporalSuffix;
        switch (type) {
            case 1: return Temporal.ZonedDateTime.from(str);
            case 2: return Temporal.PlainDateTime.from(str);
            case 3: return Temporal.PlainDate.from(str);
            case 4: return Temporal.PlainTime.from(str);
        }
    }
    catch (e) {
        TomlError.x(e instanceof Error ? e.message : '' + e, ctx, errPtr);
    }
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/util.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/** @internal */
function skipComment(ctx) {
    for (; ctx.p < ctx.s.length; ctx.p++) {
        let c = ctx.s.charCodeAt(ctx.p);
        if (c === 0xa /* \n */)
            break;
        if (c === 0xd /* \r */ && ctx.s.charCodeAt(ctx.p + 1) === 0xa /* \n */) {
            ctx.p++;
            break;
        }
        if ((c < 0x20 && c !== 0x9 /* \t */) || c === 0x7f) {
            TomlError.x('control characters are not allowed in comments', ctx);
        }
    }
}
/** @internal */
function skipVoid(ctx, banNewLines, banComments) {
    let c;
    while (ctx.p < ctx.s.length) {
        while (ctx.p < ctx.s.length && ((c = ctx.s.charCodeAt(ctx.p)) === 0x20 ||
            c === 0x9 /* \t */ ||
            (!banNewLines &&
                (c === 0xa /* \n */ || (c === 0xd /* \r */ && ctx.s.charCodeAt(ctx.p + 1) === 0xa /* \n */)))))
            ctx.p++;
        if (banComments || c !== 0x23 /* # */)
            break;
        skipComment(ctx);
    }
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/struct.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */




/** @internal */
function parseKey(ctx, end = 0x3d /* = */) {
    // States:
    // 0: before first char
    // 1: parsing bare key
    // 2: after key component
    let startPtr;
    let state = 0;
    let parsed = [];
    let sliceStart;
    let c = ctx.s.charCodeAt(startPtr = ctx.p);
    do {
        // End of key
        if (c === end) {
            if (!state)
                TomlError.x('unexpected end of key', ctx);
            if (state === 1)
                parsed.push(ctx.s.slice(sliceStart, ctx.p));
            return ctx.p++, parsed;
        }
        // Dotted key separator
        else if (c === 0x2e /* . */) {
            if (!state)
                TomlError.x('illegal empty bare key', ctx);
            if (state === 1)
                parsed.push(ctx.s.slice(sliceStart, ctx.p));
            state = 0;
        }
        // Quoted key
        else if (!state && (c === 0x22 /* " */ || c === 0x27 /* ' */)) {
            if (c === ctx.s.charCodeAt(ctx.p + 1) && c === ctx.s.charCodeAt(ctx.p + 2))
                TomlError.x('illegal quoted key: multiline strings are not allowed', ctx);
            parsed.push(parseString(ctx));
            state = 2;
            ctx.p--;
        }
        // Whitespace; no-op in state 0 and 2, end of bare key in state 1
        else if (c === 0x20 || c === 0x9 /* \t */) {
            if (state === 1) {
                parsed.push(ctx.s.slice(sliceStart, ctx.p));
                state = 2;
            }
        }
        // If state is post-key, no character is allowed; otherwise ensure it's a bare-key component
        else if (state === 2 || (c < 0x30 && c !== 0x2d /* - */) || (c > 0x39 && c < 0x41) || (c > 0x5a && c < 0x61 && c !== 0x5f /* _ */) || c > 0x7a) {
            TomlError.x('illegal character in key', ctx);
        }
        // Illegal character
        else if (!state) {
            state = 1;
            sliceStart = ctx.p;
        }
    } while (c = ctx.s.charCodeAt(++ctx.p));
    TomlError.x('incomplete key-value: cannot find end of key', ctx, startPtr);
}
/** @internal */
function parseInlineTable(ctx) {
    let startPtr = ctx.p++;
    let res = Object.create(null);
    let seen = new Set();
    let c;
    while (ctx.p < ctx.s.length) {
        skipVoid(ctx);
        if ((c = ctx.s.charCodeAt(ctx.p)) === 0x7d /* } */) {
            ctx.p++;
            return res;
        }
        let k;
        let t = res;
        let hasOwn = false;
        let errPtr = ctx.p;
        let key = parseKey(ctx);
        for (let i = 0; i < key.length; i++) {
            if (i)
                t = hasOwn ? t[k] : (t[k] = Object.create(null));
            k = key[i];
            if ((hasOwn = Object.hasOwn(t, k)) && (typeof t[k] !== 'object' || seen.has(t[k]))) {
                TomlError.x('trying to redefine an already defined value', ctx, errPtr);
            }
            let unsafe = k === '__proto__';
            if (ctx.uk && (unsafe || k === 'constructor')) {
                t = ctx.uk !== 1 && TomlError.x('document contains an unsafe property', ctx, errPtr);
                break;
            }
            if (!hasOwn && unsafe) {
                Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
            }
        }
        if (hasOwn) {
            TomlError.x('trying to redefine an already defined value', ctx, errPtr);
        }
        skipVoid(ctx, true, true);
        let value = extractValue(ctx, 0x7d /* } */);
        if (t && typeof (t[k] = value) === 'object')
            seen.add(value);
        skipVoid(ctx);
        if ((c = ctx.s.charCodeAt(ctx.p++)) === 0x7d /* } */) {
            return res;
        }
        if (c !== 0x2c /* , */)
            TomlError.x('expected comma or end of structure', ctx, ctx.p - 1);
    }
    TomlError.x('unfinished table', ctx, startPtr);
}
/** @internal */
function parseArray(ctx) {
    let startPtr = ctx.p++;
    let res = [];
    let c;
    while (ctx.p < ctx.s.length) {
        skipVoid(ctx);
        if ((c = ctx.s.charCodeAt(ctx.p)) === 0x5d /* ] */) {
            ctx.p++;
            return res;
        }
        res.push(extractValue(ctx, 0x5d /* ] */));
        skipVoid(ctx);
        if ((c = ctx.s.charCodeAt(ctx.p++)) === 0x5d /* ] */) {
            return res;
        }
        if (c !== 0x2c /* , */)
            TomlError.x('expected comma or end of structure', ctx, ctx.p - 1);
    }
    TomlError.x('unfinished array', ctx, startPtr);
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/parse.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */




function peekTable(ctx, key, table, meta, type) {
    let t = table;
    let m = meta;
    let k;
    let hasOwn = false;
    let state;
    for (let i = 0; i < key.length; i++) {
        if (i) {
            t = hasOwn ? t[k] : (t[k] = Object.create(null));
            m = (state = m[k]).c;
            if (type === 0 /* Type.DOTTED */ && (state.t === 1 /* Type.EXPLICIT */ || state.t === 2 /* Type.ARRAY */)) {
                return null;
            }
            if (state.t === 2 /* Type.ARRAY */) {
                let l = t.length - 1;
                t = t[l];
                m = m[l].c;
            }
        }
        k = key[i];
        if ((hasOwn = Object.hasOwn(t, k)) && m[k]?.t === 0 /* Type.DOTTED */ && m[k]?.d) {
            return null;
        }
        if (!hasOwn) {
            let unsafe = k === '__proto__';
            if (ctx.uk && (unsafe || k === 'constructor'))
                return false;
            if (unsafe) {
                Object.defineProperty(t, k, { enumerable: true, configurable: true, writable: true });
                Object.defineProperty(m, k, { enumerable: true, configurable: true, writable: true });
            }
            m[k] = {
                t: i < key.length - 1 && type === 2 /* Type.ARRAY */
                    ? 3 /* Type.ARRAY_DOTTED */ : type,
                d: false,
                i: 0,
                c: Object.create(null),
            };
        }
    }
    state = m[k];
    if (state.t !== type && !(type === 1 /* Type.EXPLICIT */ && state.t === 3 /* Type.ARRAY_DOTTED */)) {
        // Bad key type!
        return null;
    }
    if (type === 2 /* Type.ARRAY */) {
        if (!state.d) {
            state.d = true;
            t[k] = [];
        }
        t[k].push(t = Object.create(null));
        state.c[state.i++] = (state = { t: 1 /* Type.EXPLICIT */, d: false, i: 0, c: Object.create(null) });
    }
    if (state.d) {
        // Redefining a table!
        return null;
    }
    state.d = true;
    if (type === 1 /* Type.EXPLICIT */) {
        t = hasOwn ? t[k] : (t[k] = Object.create(null));
    }
    else if (type === 0 /* Type.DOTTED */ && hasOwn) {
        return null;
    }
    return [k, t, state.c];
}
function validateTablePeek(ctx, peek, ptr) {
    if (peek === null || ctx.uk === 2)
        TomlError.x(peek === null
            ? 'trying to redefine an already defined table or value'
            : 'document contains an unsafe property', ctx, ptr);
}
function parse(toml, options = {}) {
    let ctx = {
        s: toml,
        p: 0,
        d: options.maxDepth ?? 1000,
        bi: options.integersAsBigInt ?? false,
        ld: options.useLegacyDate ?? true,
        uk: options.unsafeKeyBehaviour === 'throw' ? 2 : options.unsafeKeyBehaviour === 'drop' ? 1 : 0,
    };
    let res = Object.create(null);
    let meta = Object.create(null);
    let tmp;
    let skipping = false;
    let tbl = res;
    let m = meta;
    // BOM is allowed, skip.
    // JS is UTF-16, so we have to check for the UTF-16 BOM instead of the UTF-8 BOM sequence!
    if (toml.charCodeAt(0) === 0xfeff)
        ctx.p++;
    skipVoid(ctx);
    while (ctx.p < toml.length) {
        if (toml.charCodeAt(ctx.p) === 0x5b /* [ */) {
            let isTableArray = toml.charCodeAt(++ctx.p) === 0x5b; /* [ */
            tmp = ctx.p += +isTableArray;
            skipping = false;
            let k = parseKey(ctx, 0x5d /* ] */);
            if (isTableArray) {
                if (toml.charCodeAt(ctx.p) !== 0x5d /* ] */) {
                    TomlError.x('expected end of table array declaration', ctx);
                }
                ctx.p++;
            }
            let p = peekTable(ctx, k, res, meta, isTableArray ? 2 /* Type.ARRAY */ : 1 /* Type.EXPLICIT */);
            if (!p) {
                validateTablePeek(ctx, p, tmp);
                skipping = true;
            }
            else {
                m = p[2];
                tbl = p[1];
            }
        }
        else {
            tmp = ctx.p;
            let k = parseKey(ctx);
            let p = peekTable(ctx, k, tbl, m, 0 /* Type.DOTTED */);
            if (!p && !skipping)
                validateTablePeek(ctx, p, tmp);
            skipVoid(ctx, true, true);
            let v = extractValue(ctx, void 0);
            if (p && !skipping)
                p[1][p[0]] = v;
        }
        skipVoid(ctx, true);
        if (ctx.p < toml.length && (tmp = toml.charCodeAt(ctx.p)) !== 0xa /* \n */ && (tmp !== 0xd /* \r */ || toml.charCodeAt(ctx.p + 1) !== 0xa /* \n */)) {
            TomlError.x('each key-value declaration must be followed by an end-of-line', ctx);
        }
        skipVoid(ctx);
    }
    return res;
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/stringify.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */
let BARE_KEY = /^[a-z0-9-_]+$/i;
let HAS_WELLFORMED = !!(''.isWellFormed);
function extendedTypeOf(obj) {
    let type = typeof obj;
    if (type === 'object') {
        if (Array.isArray(obj))
            return 'array';
        if (typeof obj.getUTCDate === 'function' && obj instanceof Date)
            return 'date';
        if (globalThis.Temporal) {
            if (obj.until) {
                if (obj instanceof Temporal.ZonedDateTime)
                    return 'temporal/tz+uc';
                if (obj instanceof Temporal.PlainDateTime || obj instanceof Temporal.PlainDate)
                    return 'temporal/uc';
                if (obj instanceof Temporal.PlainTime || obj instanceof Temporal.Instant)
                    return 'temporal';
                if (obj instanceof Temporal.PlainYearMonth)
                    return 'temporal/x';
            }
            else if ((obj.toPlainDate && obj instanceof Temporal.PlainMonthDay) ||
                (obj.negated && obj instanceof Temporal.Duration)) {
                return 'temporal/x';
            }
        }
    }
    return type;
}
function isArrayOfTables(obj) {
    for (let i = 0; i < obj.length; i++) {
        if (extendedTypeOf(obj[i]) !== 'object')
            return false;
    }
    return obj.length != 0;
}
function formatWellFormedStringUnchecked(s) {
    return JSON.stringify(s).replaceAll('\x7f', '\\u007f');
}
function formatString(s) {
    return formatWellFormedStringUnchecked(HAS_WELLFORMED ? s.toWellFormed() : s);
}
function formatKey(s) {
    if (BARE_KEY.test(s))
        return s;
    if (HAS_WELLFORMED && !s.isWellFormed())
        throw new RangeError('key contains illegal lone surrogates');
    return formatWellFormedStringUnchecked(s);
}
function stringifyValue(val, type, depth, numberAsFloat, strictTemporal) {
    if (depth === 0) {
        throw new Error('Could not stringify the object: maximum object depth exceeded');
    }
    switch (type) {
        // @ts-expect-error -- intentional fallthrough case
        case 'number':
            if (isNaN(val))
                return 'nan';
            if (val === Infinity)
                return 'inf';
            if (val === -Infinity)
                return '-inf';
            if (Number.isInteger(val) && (numberAsFloat || !Number.isSafeInteger(val)))
                return val.toFixed(1);
        case 'bigint':
        case 'boolean':
        case 'temporal':
            return val.toString();
        case 'string':
            return formatString(val);
        case 'date':
            if (isNaN(val.getTime()))
                throw new TypeError('cannot serialize invalid date');
            return val.toISOString();
        case 'object':
            return stringifyInlineTable(val, depth, numberAsFloat, strictTemporal);
        case 'array':
            return stringifyArray(val, depth, numberAsFloat, strictTemporal);
        // @ts-expect-error -- intentional fallthrough case
        case 'temporal/tz+uc':
            if (strictTemporal) {
                let tz = val.timeZoneId;
                let tzc = tz.charCodeAt(0);
                if (
                // Classic offset
                tzc !== 0x2b /* + */ && tzc !== 0x2d /* - */ &&
                    (
                    // Fast pre-check pass; see below for the actually accepted values
                    (tzc !== 0x55 /* U */ && tzc !== 0x47 /* G */ && tzc !== 0x5a /* Z */ && tzc !== 0x45 /* E */) ||
                        (
                        // UTC and its aliases; Temporal implementations don't all canonicalise unfortunately
                        tz !== 'UTC' && tz !== 'UCT' && tz !== 'Universal' && tz !== 'Zulu' &&
                            // GMT is a TZ but it's for all intents and purposes equivalent to UTC. Safe to downgrade.
                            !tz.startsWith('GMT') && tz !== 'Greenwich' &&
                            // Etc/* are all safe to downgrade to offset (either UTC, GMT, or offset)
                            !tz.startsWith('Etc/')))) {
                    throw new TypeError('Temporal objects with an IANA timezone are not allowed in Temporal strict mode');
                }
            }
        case 'temporal/uc':
            if (strictTemporal && val.calendarId !== 'iso8601')
                throw new TypeError('Temporal objects with a non-default calendar are not allowed in Temporal strict mode');
            return val.toString({
                calendarName: 'never',
                timeZoneName: 'never',
            });
        case 'temporal/x':
            throw new TypeError('Unsupported ' + val[Symbol.toStringTag]);
    }
}
function stringifyInlineTable(obj, depth, numberAsFloat, strictTemporal) {
    let keys = Object.keys(obj);
    if (keys.length === 0)
        return '{}';
    let res = '{ ';
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (i)
            res += ', ';
        res += formatKey(k) + ' = ' + stringifyValue(obj[k], extendedTypeOf(obj[k]), depth - 1, numberAsFloat, strictTemporal);
    }
    return res + ' }';
}
function stringifyArray(array, depth, numberAsFloat, strictTemporal) {
    if (array.length === 0)
        return '[]';
    let res = '[ ';
    for (let i = 0; i < array.length; i++) {
        if (i)
            res += ', ';
        if (array[i] === null || array[i] === void 0) {
            throw new TypeError('arrays cannot contain null or undefined values');
        }
        res += stringifyValue(array[i], extendedTypeOf(array[i]), depth - 1, numberAsFloat, strictTemporal);
    }
    return res + ' ]';
}
function stringifyArrayTable(array, key, depth, numberAsFloat, strictTemporal) {
    if (depth === 0) {
        throw new Error('Could not stringify the object: maximum object depth exceeded');
    }
    let res = '';
    for (let i = 0; i < array.length; i++) {
        res += `${res && '\n'}[[${key}]]\n`;
        res += stringifyTable(0, array[i], key, depth, numberAsFloat, strictTemporal);
    }
    return res;
}
function stringifyTable(tableKey, obj, prefix, depth, numberAsFloat, strictTemporal) {
    if (depth === 0) {
        throw new Error('Could not stringify the object: maximum object depth exceeded');
    }
    let preamble = '';
    let tables = '';
    let keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        if (obj[k] !== null && obj[k] !== void 0) {
            let type = extendedTypeOf(obj[k]);
            if (type === 'symbol' || type === 'function') {
                throw new TypeError(`cannot serialize values of type '${type}'`);
            }
            let key = formatKey(k);
            if (type === 'array' && isArrayOfTables(obj[k])) {
                tables += (tables && '\n') + stringifyArrayTable(obj[k], prefix ? `${prefix}.${key}` : key, depth - 1, numberAsFloat, strictTemporal);
            }
            else if (type === 'object') {
                let tblKey = prefix ? `${prefix}.${key}` : key;
                tables += (tables && '\n') + stringifyTable(tblKey, obj[k], tblKey, depth - 1, numberAsFloat, strictTemporal);
            }
            else {
                preamble += key;
                preamble += ' = ';
                preamble += stringifyValue(obj[k], type, depth, numberAsFloat, strictTemporal);
                preamble += '\n';
            }
        }
    }
    if (tableKey && (preamble || !tables)) // Create table only if necessary
        preamble = preamble ? `[${tableKey}]\n${preamble}` : `[${tableKey}]`;
    return preamble && tables
        ? `${preamble}\n${tables}`
        : preamble || tables;
}
function stringify(obj, { maxDepth = 1000, numbersAsFloat = false, strictTemporal = false } = {}) {
    if (extendedTypeOf(obj) !== 'object') {
        throw new TypeError('stringify can only be called with an object');
    }
    let str = stringifyTable(0, obj, '', maxDepth, numbersAsFloat, strictTemporal);
    if (str[str.length - 1] !== '\n')
        return str + '\n';
    return str;
}

;// CONCATENATED MODULE: ./node_modules/smol-toml/dist/index.js
/*!
 * Copyright (c) Squirrel Chat et al., All rights reserved.
 * SPDX-License-Identifier: BSD-3-Clause
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the
 *    documentation and/or other materials provided with the distribution.
 * 3. Neither the name of the copyright holder nor the names of its contributors
 *    may be used to endorse or promote products derived from this software without
 *    specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE
 * FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 * DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
 * SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
 * CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
 * OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */





/** @deprecated use `import * as ... from 'smol-toml'` instead */
/* harmony default export */ const dist = ({ parse: parse, stringify: stringify, TomlDate: TomlDate, TomlError: TomlError });

;// CONCATENATED MODULE: ./src/defaults.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
/**
 * The org rules and the org allowlist, in gitleaks' own TOML schema. They are merged with gitleaks' default rules
 * (`useDefault`) and with the repository's `.secret-me.toml` (see docs/config.md).
 *
 * Every allowlist entry carries a `description`: the reason this value is safe to ignore.
 */
const DEFAULT_CONFIG = String.raw `
title = "secret-me"

[[rules]]
id = "secret-me-anthropic-key"
description = "Anthropic API key"
regex = '''sk-ant-[a-z0-9]{2,8}-[A-Za-z0-9_\-]{20,}'''
keywords = ["sk-ant-"]

[[rules]]
id = "secret-me-github-token"
description = "GitHub token (personal, OAuth, user-to-server, server-to-server, refresh, fine-grained)"
regex = '''\b(?:gh[pousr]_[A-Za-z0-9]{30,255}|github_pat_[A-Za-z0-9_]{50,255})\b'''
keywords = ["ghp_", "gho_", "ghu_", "ghs_", "ghr_", "github_pat_"]

[[rules]]
id = "secret-me-private-key"
description = "Private key block"
regex = '''-----BEGIN[ A-Z0-9]*PRIVATE KEY(?: BLOCK)?-----\s*(?:[A-Za-z0-9+/=:,. -]+\s+)?([A-Za-z0-9+/=]{16,})'''
secretGroup = 1
keywords = ["private key"]

[[rules]]
id = "secret-me-env-file"
description = "A .env file (it holds secrets by design; keep it out of git)"
path = '''(?:^|/)\.env(?:\.[A-Za-z0-9_-]+)?$'''
  [[rules.allowlists]]
  description = ".env.example and friends are templates, not secrets"
  paths = ['''\.(?:example|sample|template|dist|defaults?)$''']

[[rules]]
id = "secret-me-url-credentials"
description = "Password in a URL (scheme://user:password@host)"
regex = '''[A-Za-z][A-Za-z0-9+.-]*://[^\s:@/"'<>]+:([^\s@/"'<>$][^\s@/"'<>]{2,})@[A-Za-z0-9.\-\[\]]+'''
secretGroup = 1
entropy = 2.0
keywords = ["://"]
  [[rules.allowlists]]
  description = "Placeholders and variable references in URLs"
  regexes = ['''^(?i:pass(?:w(?:or)?d)?|changeme|secret|x+|\*+|\{\{.*|%s)$''']
  stopwords = ["changeme", "example"]

[[rules]]
id = "secret-me-password-assignment"
description = "Quoted password, secret, token or key assigned in code or config"
regex = '''(?i)\b[\w.-]*(?:password|passwd|pwd|secret|api[_-]?key|access[_-]?key|auth[_-]?token|token|credential)s?["']?\s*[:=]\s*["']([^\s"'$<>{}()\[\]][^\s"']{7,})["']'''
secretGroup = 1
entropy = 3.3
keywords = ["password", "passwd", "pwd", "secret", "key", "token", "credential"]
  [[rules.allowlists]]
  description = "Placeholders, test values and references"
  stopwords = ["example", "changeme", "placeholder", "your_", "your-", "xxxxxxxx", "process.env", "secrets.", "env."]

[[rules]]
id = "secret-me-config-assignment"
description = "Unquoted password, secret, token or key in an env, ini, yaml or properties file"
regex = '''(?im)^\s*(?:export\s+)?[\w.-]*(?:password|passwd|secret|api[_-]?key|access[_-]?key|auth[_-]?token|token|credential)s?\s*[:=]\s*([^\s"'$<>{}()\[\],;#][^\s"',;#]{7,})\s*$'''
secretGroup = 1
entropy = 3.5
keywords = ["password", "passwd", "secret", "key", "token", "credential"]
path = '''(?:^|/)(?:\.env[^/]*|[^/]*\.(?:env|ini|cfg|conf|properties|toml|ya?ml|json|tfvars))$'''
  [[rules.allowlists]]
  description = "Placeholders and references"
  stopwords = ["example", "changeme", "placeholder", "your_", "your-", "process.env", "secrets."]

[[allowlists]]
description = "Azure Storage emulator (Azurite) well-known development account key, published in Microsoft's docs and bundled in @azure/storage-blob"
regexes = ['''Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==''']

[[allowlists]]
description = "Installed dependencies are not ours to scan (their lockfiles and bundles are covered by their publishers)"
paths = ['''(?:^|/)node_modules/''']
`;

;// CONCATENATED MODULE: ./src/config.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */




/** The repository's configuration file, at its root. */
const CONFIG_FILE = ".secret-me.toml";
/** A configuration error (exit code 2). */
class ConfigError extends Error {
}
function asArray(value) {
    if (value === undefined)
        return [];
    if (!Array.isArray(value))
        throw new ConfigError("rules and allowlists must be TOML arrays of tables ([[rules]], [[allowlists]])");
    return value;
}
/** Every allowlist entry (also those nested in a rule) must say why the value is safe. */
function checkReasons(config, source) {
    const check = (entry, where) => {
        const reason = entry.description;
        if (typeof reason !== "string" || reason.trim() === "") {
            throw new ConfigError(`${source}: ${where} has no description; every allowlist entry needs the reason it is safe`);
        }
    };
    asArray(config.allowlists).forEach((a, i) => check(a, `[[allowlists]] #${i + 1}`));
    if (config.allowlist !== undefined)
        check(config.allowlist, "[allowlist]");
    asArray(config.rules).forEach(rule => {
        asArray(rule.allowlists).forEach((a, i) => check(a, `rule ${String(rule.id)}: [[rules.allowlists]] #${i + 1}`));
    });
}
/**
 * Merges the org defaults with the repository's configuration (rules and allowlists are appended) and tells
 * gitleaks to extend its own default rules.
 */
function mergeConfig(repoToml, repoSource = CONFIG_FILE) {
    const defaults = parse(DEFAULT_CONFIG);
    let repo = {};
    if (repoToml !== undefined) {
        try {
            repo = parse(repoToml);
        }
        catch (error) {
            throw new ConfigError(`${repoSource}: ${error.message}`);
        }
        checkReasons(repo, repoSource);
    }
    const allowlists = [...asArray(defaults.allowlists), ...asArray(repo.allowlists)];
    if (repo.allowlist !== undefined)
        allowlists.push(repo.allowlist);
    return {
        title: "secret-me",
        extend: { useDefault: true },
        rules: [...asArray(defaults.rules), ...asArray(repo.rules)],
        allowlists,
    };
}
/** Reads `.secret-me.toml` (or the given file) from the folder and merges it; a missing default file is fine. */
function loadConfig(root, file) {
    const target = external_node_path_namespaceObject.resolve(root, file ?? CONFIG_FILE);
    if (!external_node_fs_namespaceObject.existsSync(target)) {
        if (file)
            throw new ConfigError(`configuration file not found: ${file}`);
        return mergeConfig();
    }
    return mergeConfig(external_node_fs_namespaceObject.readFileSync(target, "utf8"), external_node_path_namespaceObject.relative(root, target) || CONFIG_FILE);
}
/** The merged configuration as the TOML gitleaks reads. */
function toToml(config) {
    return stringify(config);
}

;// CONCATENATED MODULE: ./src/finding.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
const ROTATE_NOTE = "already pushed: rotate it first (revoke and reissue), then clean the history";
/** The first 4 characters, then `****` (at most half of a short value, so it never reveals it). */
function redact(secret) {
    const keep = Math.min(4, Math.floor(secret.length / 2));
    return `${secret.slice(0, keep)}****`;
}
/** One line per finding, compact for people and LLMs. */
function formatText(findings) {
    if (findings.length === 0)
        return "secret-me: no secrets found\n";
    const lines = [`secret-me: ${findings.length} ${findings.length === 1 ? "secret" : "secrets"} found`];
    for (const f of findings) {
        const where = f.line > 0 ? `${f.file}:${f.line}` : f.file;
        const commit = f.commit ? ` commit ${f.commit.slice(0, 8)}` : "";
        lines.push(`  ${where}  ${f.rule}  ${f.redacted}${commit}${f.note ? `  (${f.note})` : ""}`);
    }
    return `${lines.join("\n")}\n`;
}

// EXTERNAL MODULE: ./node_modules/@dev-build-deploy/sarif-it/lib/index.js
var lib = __nccwpck_require__(482);
;// CONCATENATED MODULE: ./src/version.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */
/** The tool version, reported by the CLI. */
const VERSION = "0.1.0";

;// CONCATENATED MODULE: ./src/sarif.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */


/** The findings as a SARIF 2.1.0 log (for GitHub code scanning). Values stay redacted. */
function toSarif(findings) {
    const tool = new lib/* Tool */.NL("secret-me")
        .organization("dev-build-deploy")
        .version(VERSION)
        .informationUri("https://github.com/dev-build-deploy/secret-me#readme");
    const seen = new Set();
    for (const f of findings) {
        if (seen.has(f.rule))
            continue;
        seen.add(f.rule);
        tool.addRule(new lib/* Rule */.jO(f.rule).name(f.rule).shortDescription(f.description));
    }
    const run = new lib/* Run */.KF(tool);
    for (const f of findings) {
        const rotate = f.note ? `; ${f.note}` : "";
        run.addResult(new lib/* Result */.Q7(`${f.description}: ${f.redacted}${rotate}`, { level: "error", ruleId: f.rule }).addLocation({
            physicalLocation: {
                artifactLocation: { uri: f.file },
                region: { startLine: Math.max(f.line, 1) },
            },
        }));
    }
    return new lib/* Log */.tG().addRun(run).properties();
}

;// CONCATENATED MODULE: external "node:os"
const external_node_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");
;// CONCATENATED MODULE: external "node:crypto"
const external_node_crypto_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:crypto");
;// CONCATENATED MODULE: ./src/gitleaks.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */






const run = (0,external_node_util_namespaceObject.promisify)(external_node_child_process_namespaceObject.execFile);
/** The gitleaks release secret-me is built and tested against. */
const GITLEAKS_VERSION = "8.30.1";
/** SHA-256 of each release archive, from gitleaks_8.30.1_checksums.txt of the release. */
const GITLEAKS_CHECKSUMS = {
    "darwin_arm64.tar.gz": "b40ab0ae55c505963e365f271a8d3846efbc170aa17f2607f13df610a9aeb6a5",
    "darwin_x64.tar.gz": "dfe101a4db2255fc85120ac7f3d25e4342c3c20cf749f2c20a18081af1952709",
    "linux_arm64.tar.gz": "e4a487ee7ccd7d3a7f7ec08657610aa3606637dab924210b3aee62570fb4b080",
    "linux_x64.tar.gz": "551f6fc83ea457d62a0d98237cbad105af8d557003051f41f3e7ca7b3f2470eb",
    "windows_arm64.zip": "b95f5e4f5c425cedca7ee203d9afd29597e692c4924a12ed42f970537c72cc0f",
    "windows_x64.zip": "d29144deff3a68aa93ced33dddf84b7fdc26070add4aa0f4513094c8332afc4e",
};
/** Compares dotted versions: negative when a < b. */
function compareVersions(a, b) {
    const pa = a.replace(/^v/, "").split(".").map(Number);
    const pb = b.replace(/^v/, "").split(".").map(Number);
    for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
        const d = (pa[i] ?? 0) - (pb[i] ?? 0);
        if (d !== 0)
            return d;
    }
    return 0;
}
/** The archive suffix of this platform, as keyed in GITLEAKS_CHECKSUMS. */
function platformAsset(platform = process.platform, arch = process.arch) {
    const os_ = platform === "win32" ? "windows" : platform;
    const cpu = arch === "x64" ? "x64" : arch === "arm64" ? "arm64" : arch;
    const suffix = `${os_}_${cpu}.${platform === "win32" ? "zip" : "tar.gz"}`;
    if (!(suffix in GITLEAKS_CHECKSUMS))
        throw new Error(`no gitleaks release for ${platform}/${arch}`);
    return suffix;
}
/** The cache folder of the pinned gitleaks binary (override with SECRET_ME_CACHE). */
function cacheDir() {
    const base = process.env.SECRET_ME_CACHE ??
        external_node_path_namespaceObject.join(process.env.XDG_CACHE_HOME ?? external_node_path_namespaceObject.join(external_node_os_namespaceObject.homedir(), ".cache"), "secret-me");
    return external_node_path_namespaceObject.join(base, `gitleaks-${GITLEAKS_VERSION}`);
}
/** The version of a gitleaks binary, or undefined when it does not run. */
async function binaryVersion(bin) {
    try {
        const { stdout } = await run(bin, ["version"]);
        return /\d+\.\d+\.\d+/.exec(stdout)?.[0];
    }
    catch {
        return undefined;
    }
}
/** Refuses an archive whose SHA-256 is not the pinned one. */
function verifyChecksum(archive, suffix, source = suffix) {
    const sum = (0,external_node_crypto_namespaceObject.createHash)("sha256").update(archive).digest("hex");
    if (sum !== GITLEAKS_CHECKSUMS[suffix]) {
        throw new Error(`checksum mismatch for ${source} (got ${sum}); refusing to run it`);
    }
}
async function download(url) {
    const res = await fetch(url, { redirect: "follow" });
    if (!res.ok)
        throw new Error(`download failed (${res.status}): ${url}`);
    return Buffer.from(await res.arrayBuffer());
}
/**
 * Finds the gitleaks to run: SECRET_ME_GITLEAKS, else one on the PATH that is at least the pinned version, else the
 * pinned release from GitHub (SHA-256 verified against GITLEAKS_CHECKSUMS) cached under the user's cache folder.
 */
async function resolveGitleaks() {
    const candidates = [process.env.SECRET_ME_GITLEAKS, "gitleaks"].filter((c) => !!c);
    for (const bin of candidates) {
        const v = await binaryVersion(bin);
        if (v && compareVersions(v, GITLEAKS_VERSION) >= 0)
            return bin;
    }
    const dir = cacheDir();
    const bin = external_node_path_namespaceObject.join(dir, process.platform === "win32" ? "gitleaks.exe" : "gitleaks");
    if ((await binaryVersion(bin)) === GITLEAKS_VERSION)
        return bin;
    const suffix = platformAsset();
    const url = `https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_${suffix}`;
    const archive = await download(url);
    verifyChecksum(archive, suffix, url);
    // Extract in a private folder and move the binary into place: parallel runs must never see a half-written cache.
    external_node_fs_namespaceObject.mkdirSync(dir, { recursive: true });
    const work = external_node_fs_namespaceObject.mkdtempSync(external_node_path_namespaceObject.join(dir, "tmp-"));
    try {
        const archivePath = external_node_path_namespaceObject.join(work, `archive.${suffix.endsWith(".zip") ? "zip" : "tar.gz"}`);
        external_node_fs_namespaceObject.writeFileSync(archivePath, archive);
        await run("tar", ["-xf", archivePath, "-C", work, external_node_path_namespaceObject.basename(bin)]);
        external_node_fs_namespaceObject.chmodSync(external_node_path_namespaceObject.join(work, external_node_path_namespaceObject.basename(bin)), 0o755);
        external_node_fs_namespaceObject.renameSync(external_node_path_namespaceObject.join(work, external_node_path_namespaceObject.basename(bin)), bin);
    }
    finally {
        external_node_fs_namespaceObject.rmSync(work, { recursive: true, force: true });
    }
    return bin;
}

;// CONCATENATED MODULE: ./src/scanner.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */








const scanner_run = (0,external_node_util_namespaceObject.promisify)(external_node_child_process_namespaceObject.execFile);
/** An error that is not a finding (exit code 2). */
class ScanError extends Error {
}
async function git(cwd, args) {
    const { stdout } = await scanner_run("git", args, { cwd, maxBuffer: 64 * 1024 * 1024 });
    return stdout.trim();
}
/** The root of the git repository around `cwd`, or `cwd` itself outside one. */
async function repoRoot(cwd) {
    try {
        return await git(cwd, ["rev-parse", "--show-toplevel"]);
    }
    catch {
        return external_node_path_namespaceObject.resolve(cwd);
    }
}
/** Whether a commit is reachable from a remote-tracking branch (it has left this machine). */
async function isPushed(cwd, commit) {
    try {
        return (await git(cwd, ["for-each-ref", "--contains", commit, "--count=1", "refs/remotes"])) !== "";
    }
    catch {
        return false;
    }
}
function gitleaksArgs(target, cwd) {
    switch (target.kind) {
        case "staged":
            return ["git", "--staged", "--pre-commit", "."];
        case "range":
            return ["git", `--log-opts=${target.range}`, "."];
        case "outgoing":
            return ["git", "--log-opts=HEAD --not --remotes", "."];
        case "history":
            return ["git", "."];
        case "path":
            return ["dir", external_node_path_namespaceObject.relative(cwd, external_node_path_namespaceObject.resolve(cwd, target.path)) || "."];
        case "stdin":
            return ["dir", "."];
    }
}
/**
 * Scans the target with the pinned gitleaks and the merged secret-me configuration.
 * Findings are deduplicated per line (a gitleaks and a secret-me rule on the same line report once, the secret-me
 * rule wins) and redacted.
 */
async function scan(target, options = {}) {
    const start = external_node_path_namespaceObject.resolve(options.cwd ?? process.cwd());
    const root = await repoRoot(start);
    const work = external_node_fs_namespaceObject.mkdtempSync(external_node_path_namespaceObject.join(external_node_os_namespaceObject.tmpdir(), "secret-me-"));
    try {
        const bin = await resolveGitleaks().catch((e) => {
            throw new ScanError(`cannot get gitleaks: ${e.message}`);
        });
        const configPath = external_node_path_namespaceObject.join(work, "gitleaks.toml");
        external_node_fs_namespaceObject.writeFileSync(configPath, toToml(loadConfig(root, options.config)), { mode: 0o600 });
        let cwd = root;
        let staged;
        if (target.kind === "stdin") {
            // The content is scanned under its own relative path, so path rules and path allowlists apply to it.
            const abs = external_node_path_namespaceObject.resolve(start, target.name);
            const rel = abs.startsWith(root + external_node_path_namespaceObject.sep) ? external_node_path_namespaceObject.relative(root, abs) : external_node_path_namespaceObject.basename(abs);
            staged = external_node_path_namespaceObject.join(work, "files");
            external_node_fs_namespaceObject.mkdirSync(external_node_path_namespaceObject.dirname(external_node_path_namespaceObject.join(staged, rel)), { recursive: true });
            external_node_fs_namespaceObject.writeFileSync(external_node_path_namespaceObject.join(staged, rel), target.content, { mode: 0o600 });
            cwd = staged;
        }
        else if (target.kind === "path") {
            cwd = root;
        }
        const reportPath = external_node_path_namespaceObject.join(work, "report.json");
        const args = [
            ...gitleaksArgs(target, cwd),
            "--config",
            configPath,
            "--report-format",
            "json",
            "--report-path",
            reportPath,
            "--exit-code",
            "0",
            "--no-banner",
            "--no-color",
            "--log-level",
            "error",
        ];
        // The repository's .gitleaksignore is honoured by gitleaks; findings never reach the logs (no --verbose).
        try {
            await scanner_run(bin, args, { cwd, maxBuffer: 64 * 1024 * 1024 });
        }
        catch (error) {
            const e = error;
            throw new ScanError(`gitleaks failed: ${(e.stderr || e.message).split("\n").slice(0, 3).join(" ").trim()}`);
        }
        const raw = JSON.parse(external_node_fs_namespaceObject.readFileSync(reportPath, "utf8") || "[]");
        return await toFindings(raw ?? [], root, options.assumePushed ?? false);
    }
    finally {
        external_node_fs_namespaceObject.rmSync(work, { recursive: true, force: true });
    }
}
async function toFindings(raw, root, assumePushed) {
    const pushedCache = new Map();
    const byValue = new Map();
    for (const r of raw) {
        const key = `${r.Commit}|${r.File}|${r.StartLine}`;
        const existing = byValue.get(key);
        if (existing && (existing.rule.startsWith("secret-me-") || !r.RuleID.startsWith("secret-me-")))
            continue;
        let pushed = assumePushed && r.Commit !== "";
        if (!pushed && r.Commit) {
            if (!pushedCache.has(r.Commit))
                pushedCache.set(r.Commit, await isPushed(root, r.Commit));
            pushed = pushedCache.get(r.Commit) === true;
        }
        byValue.set(key, {
            rule: r.RuleID,
            description: r.Description,
            file: r.File.replaceAll("\\", "/"),
            line: r.StartLine,
            commit: r.Commit,
            redacted: redact(r.Secret),
            pushed,
            ...(pushed ? { note: ROTATE_NOTE } : {}),
        });
    }
    return [...byValue.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));
}

;// CONCATENATED MODULE: ./src/entrypoints/cli.ts
/*
 * SPDX-FileCopyrightText: 2026 Kevin de Jong <monkaii@hotmail.com>
 * SPDX-License-Identifier: MIT
 */







function chooseTarget(flags) {
    const modes = [flags.staged, flags.diff, flags.outgoing, flags.history, flags.path, flags.stdin].filter(Boolean);
    if (modes.length > 1) {
        throw new ScanError("choose one of --staged, --diff, --outgoing, --history, --path, --stdin");
    }
    if (flags.staged)
        return { kind: "staged" };
    if (flags.diff)
        return { kind: "range", range: flags.diff };
    if (flags.outgoing)
        return { kind: "outgoing" };
    if (flags.history)
        return { kind: "history" };
    if (flags.stdin) {
        if (!flags.name)
            throw new ScanError("--stdin needs --name <file> (the path the content is written to)");
        return { kind: "stdin", name: flags.name, content: external_node_fs_namespaceObject.readFileSync(0, "utf8") };
    }
    return { kind: "path", path: flags.path ?? "." };
}
const cli_program = new command_Command();
cli_program
    .name("secret-me")
    .description("Flags secrets, tokens and passwords before they leave your machine (gitleaks, with org rules)")
    .version(VERSION);
cli_program
    .command("scan")
    .description("Scan for secrets; exit 1 on findings, 2 on errors. Values are always redacted.")
    .option("--staged", "the staged changes (pre-commit)")
    .option("--diff <range>", "the commits in a git range, e.g. origin/main..HEAD")
    .option("--outgoing", "the commits no remote has yet (what a push would send)")
    .option("--history", "the whole git history")
    .option("--path <path>", "a file or folder, as it is on disk (default: .)")
    .option("--stdin", "content on stdin, scanned as the file --name")
    .option("--name <file>", "with --stdin: the path the content stands for")
    .option("--json", "machine-readable output")
    .option("--sarif <file>", "also write a SARIF 2.1.0 report")
    .option("--config <file>", "configuration file (default: .secret-me.toml)")
    .action(async (flags) => {
    try {
        const findings = await scan(chooseTarget(flags), { config: flags.config });
        if (flags.sarif)
            external_node_fs_namespaceObject.writeFileSync(flags.sarif, JSON.stringify(toSarif(findings), null, 2));
        if (flags.json) {
            process.stdout.write(`${JSON.stringify({ tool: "secret-me", version: VERSION, count: findings.length, findings })}\n`);
        }
        else {
            process.stdout.write(formatText(findings));
        }
        process.exitCode = findings.length > 0 ? 1 : 0;
    }
    catch (error) {
        process.stderr.write(`secret-me: error: ${error.message}\n`);
        process.exitCode = 2;
    }
});
cli_program
    .command("config")
    .description("Print the effective configuration (org rules + allowlist + .secret-me.toml) as gitleaks TOML")
    .option("--config <file>", "configuration file (default: .secret-me.toml)")
    .action((flags) => {
    try {
        process.stdout.write(toToml(loadConfig(process.cwd(), flags.config)));
    }
    catch (error) {
        process.stderr.write(`secret-me: error: ${error.message}\n`);
        process.exitCode = 2;
    }
});
cli_program.parseAsync().catch((error) => {
    process.stderr.write(`secret-me: error: ${error.message}\n`);
    process.exitCode = 2;
});

