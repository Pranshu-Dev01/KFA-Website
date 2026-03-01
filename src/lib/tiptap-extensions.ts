import { Extension } from '@tiptap/core';

export const LineHeight = Extension.create({
    name: 'lineHeight',

    addOptions() {
        return {
            types: ['paragraph', 'heading'],
            defaultLineHeight: 'normal',
        };
    },

    addGlobalAttributes() {
        return [
            {
                types: this.options.types,
                attributes: {
                    lineHeight: {
                        default: this.options.defaultLineHeight,
                        parseHTML: element => element.style.lineHeight || this.options.defaultLineHeight,
                        renderHTML: attributes => {
                            if (attributes.lineHeight === this.options.defaultLineHeight) {
                                return {};
                            }
                            return { style: `line-height: ${attributes.lineHeight}` };
                        },
                    },
                },
            },
        ];
    },

    addCommands() {
        return {
            setLineHeight: (lineHeight: string) => ({ commands }: { commands: any }) => {
                return this.options.types.every(type => commands.updateAttributes(type, { lineHeight }));
            },
            unsetLineHeight: () => ({ commands }: { commands: any }) => {
                return this.options.types.every(type => commands.resetAttributes(type, 'lineHeight'));
            },
        } as any;
    },
});
