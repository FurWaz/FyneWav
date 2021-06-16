{
    "targets": [
        {
            "target_name": "engine",
            "sources": [ "./engine/wrapper.cpp" ],
            "include_dirs": [
                "<(module_root_dir)/engine/include/"
            ],
            'conditions': [
                ['OS=="win"',
                {
                    'defines': [
                    '__WINDOWS_MM__'
                    ],
                    'link_settings': {
                    'libraries': [
                        "-l<(module_root_dir)/engine/lib/OpenAL32.lib", "<(module_root_dir)/engine/lib/OpenAL32"
                    ],
                    }
                }
                ],
                ['OS=="linux"',
                {
                    'cflags_cc!': [
                    '-fno-exceptions'
                    ],
                    'defines': [
                    '__LINUX_ALSASEQ__'
                    ],
                    'link_settings': {
                    'libraries': [
                        '-lal'
                    ]
                    }
                }
                ],
                ['OS=="mac"',
                {
                    'defines': [
                    '__MACOSX_CORE__'
                    ],
                    'xcode_settings': {
                    'GCC_ENABLE_CPP_EXCEPTIONS': 'YES'
                    },
                    'link_settings': {
                    'libraries': [
                        'OpenAL.framework',
                    ],
                    }
                }
                ]
            ]
        }
    ]
}