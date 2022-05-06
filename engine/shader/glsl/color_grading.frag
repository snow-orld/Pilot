    #version 310 es

#extension GL_GOOGLE_include_directive : enable

#include "constants.h"

layout(input_attachment_index = 0, set = 0, binding = 0) uniform highp subpassInput in_color;

layout(set = 0, binding = 1) uniform sampler2D color_grading_lut_texture_sampler;

layout(location = 0) out highp vec4 out_color;

void main()
{
    highp ivec2 lut_tex_size = textureSize(color_grading_lut_texture_sampler, 0);
    highp float _COLORS      = float(lut_tex_size.y);

    highp vec4 color         = subpassLoad(in_color).rgba;
    
    highp float max_color = _COLORS - 1.0;
    highp float half_color_x = 0.5 / float(lut_tex_size.x);
    highp float half_color_y = 0.5 / float(lut_tex_size.y);
    highp float threshold = max_color / _COLORS;

    highp float x_offset = half_color_x + color.r * threshold / _COLORS;
    highp float y_offset = half_color_y + color.g * threshold;
    highp float cell = floor(color.b * max_color) / _COLORS;

    highp vec2 uv            =  vec2(x_offset + cell, y_offset);
    highp vec4 color_sampled = texture(color_grading_lut_texture_sampler, uv);

    out_color = color_sampled;
}
