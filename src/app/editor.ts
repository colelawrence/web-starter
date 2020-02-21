import { getLogger } from './logger';
const logger = getLogger('editor')

export function createEditor() {
  return {
    options: createOptions(),
    defaultValue: code`
    When the fridge door is left open for more than 5 minutes, please text me.
    And then, take a photo from all security cameras and send that to my email.
    `,
    setMonaco(monaco: typeof import("@monaco"), ...args) {
      logger.info('setMonaco', monaco, ...args)
    }
  }
}


function createOptions(): import("@monaco").editor.IEditorOptions {
  return {
    fontSize: 18,
    fontFamily: "Martel Code",
    fontWeight: '600',
    lineNumbers: 'off',
    wordWrap: "on",
    minimap: {
      enabled: false,
    }
  }
}

function code(str: TemplateStringsArray, ...args: any[]): string {
  if (str.length < 1) { return '' }
  let build: string[] = [str[0]]
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    const following = str[i + 1]
    build.push(String(arg), following)
  }
  let complete = build.join('')
  logger.info(JSON.stringify(complete))
  const newline = complete.match(/^\n([ \t]+)/)
  if (newline != null) {
    return complete.replace(new RegExp(`\\n${newline[1].replace(/\t/g, '\\t')}`, 'g'), '\n').slice(1)
  } else {
    return complete
  }
}