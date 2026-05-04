package com.ethara.taskmanager.dto;

import jakarta.validation.constraints.NotEmpty;
import java.util.Set;

public record AddMembersRequest(@NotEmpty Set<Long> userIds) {
}
