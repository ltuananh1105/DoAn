package com.learnup.backend.entity;

import tools.jackson.core.JsonGenerator;
import tools.jackson.databind.SerializationContext;
import tools.jackson.databind.ValueSerializer;

public class HiddenPasswordSerializer extends ValueSerializer<String> {
    @Override
    public void serialize(String value, JsonGenerator generator, SerializationContext context) {
        generator.writeNull();
    }
}
