import * as fileUtils from '../file-utils';
import { generateFileNames, GenerateFileNamesPayload } from './generate-file-names';

describe('Tests for generateFileNames for component', () => {
    const ARGS: GenerateFileNamesPayload = {
        fileName: 'Awesome',
        itemType: 'component',
        templatesRoot: './templates',
    };

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(fileUtils, 'readDir').mockResolvedValueOnce([
            'component.model.ts.mustache',
            'component.module.scss.mustache',
            'component.spec.tsx.mustache',
            'component.tsx.mustache',
            'index.ts.mustache',
        ] as any);
    });

    it('Should produce an array of file names to generate', async () => {
        // Arrange
        const expectedFileNames = ['Awesome.model.ts', 'Awesome.module.scss', 'Awesome.spec.tsx', 'Awesome.tsx', 'index.ts'];

        // Act
        const { fileNamesToGenerate } = await generateFileNames(ARGS);

        // Assert
        expect(fileNamesToGenerate).toEqual(expectedFileNames);
    });
    it('Should produce an array of template file names', async () => {
        // Arrange
        const expectedFileNames = [
            'component.model.ts.mustache',
            'component.module.scss.mustache',
            'component.spec.tsx.mustache',
            'component.tsx.mustache',
            'index.ts.mustache',
        ];

        // Act
        const { templateFileNames } = await generateFileNames(ARGS);

        // Assert
        expect(templateFileNames).toEqual(expectedFileNames);
    });
    it('Should produce itemTemplatesDir', async () => {
        // Arrange
        const expectedItemTemplatesDir = 'templates\\component';

        // Act
        const { itemTemplatesDir } = await generateFileNames(ARGS);

        // Assert
        expect(itemTemplatesDir).toEqual(expectedItemTemplatesDir);
    });
});

describe('Tests for generateFileNames for hook', () => {
    const ARGS: GenerateFileNamesPayload = {
        fileName: 'Awesome',
        itemType: 'hook',
        templatesRoot: './templates',
    };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(fileUtils, 'readDir').mockResolvedValue(['index.ts.mustache', 'usehook.spec.ts.mustache', 'usehook.ts.mustache'] as any);
    });

    it('Should produce an array of hook file names to generate', async () => {
        // Arrange
        const expectedFileNames = ['index.ts', 'useAwesome.spec.ts', 'useAwesome.ts'];

        // Act
        const { fileNamesToGenerate } = await generateFileNames(ARGS);

        // Assert
        expect(fileNamesToGenerate).toEqual(expectedFileNames);
    });
    it('Should produce an array of hook template file names', async () => {
        // Arrange
        const expectedFileNames = ['index.ts.mustache', 'usehook.spec.ts.mustache', 'usehook.ts.mustache'];

        // Act
        const { templateFileNames } = await generateFileNames(ARGS);

        // Assert
        expect(templateFileNames).toEqual(expectedFileNames);
    });
});

describe('Tests for generateFileNames for component with nested folders', () => {
    const ARGS: GenerateFileNamesPayload = {
        fileName: 'Awesome',
        itemType: 'component',
        templatesRoot: './templates',
    };

    let dirSpy: any = null;

    beforeEach(() => {
        jest.clearAllMocks();
        dirSpy = jest
            .spyOn(fileUtils, 'readDir')
            .mockResolvedValueOnce([
                'component.model.ts.mustache',
                'component.module.scss.mustache',
                'component.spec.tsx.mustache',
                'component.tsx.mustache',
                'index.ts.mustache',
                'nested-folder',
            ] as any)
            .mockResolvedValueOnce([
                'nested-folder.component.tsx.mustache',
                'nested-folder.index.ts.mustache',
                'deeper-nested-folder',
            ] as any)
            .mockResolvedValueOnce(['deeper-nested-folder.component.tsx.mustache', 'deeper-nested-folder.index.ts.mustache'] as any);
    });

    it('Should traverse all 3 directories', async () => {
        // Arrange
        const expectedDirCalls = 3;

        // Act
        await generateFileNames(ARGS);

        // Assert
        expect(dirSpy).toHaveBeenCalledTimes(expectedDirCalls);
    });

    it('Should produce an array of file names and folders to generate', async () => {
        // Arrange
        const expectedFileNames = [
            'Awesome.model.ts',
            'Awesome.module.scss',
            'Awesome.spec.tsx',
            'Awesome.tsx',
            'index.ts',
            'nested-folder/nested-folder.Awesome.tsx',
            'nested-folder/nested-folder.index.ts',
            'nested-folder/deeper-nested-folder/deeper-nested-folder.Awesome.tsx',
            'nested-folder/deeper-nested-folder/deeper-nested-folder.index.ts',
        ];

        // Act
        const { fileNamesToGenerate } = await generateFileNames(ARGS);

        // Assert
        expect(fileNamesToGenerate).toEqual(expectedFileNames);
    });
});
