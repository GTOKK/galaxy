if [ -n "$SLURM_JOB_ID" ]; then
    GALAXY_MEMORY_MB=`scontrol -do show job "$SLURM_JOB_ID" | sed 's/.*\( \|^\)Mem=\([0-9][0-9]*\)\( \|$\).*/\2/p;d'` 2>memory_statement.log
fi

if [ -z "$GALAXY_MEMORY_MB_PERSLOT" -a -n "$GALAXY_MEMORY_MB" ]; then
    GALAXY_MEMORY_MB_PERSLOT=$(($GALAXY_MEMORY_MB / $GALAXY_SLOTS))
elif [ -z "$GALAXY_MEMORY_MB" -a -n "$GALAXY_MEMORY_MB_PERSLOT" ]; then
    GALAXY_MEMORY_MB=$(($GALAXY_MEMORY_MB_PERSLOT * $GALAXY_SLOTS))
fi
[ "${GALAXY_MEMORY_MB--1}" -gt 0 ] 2>>memory_statement.log && export GALAXY_MEMORY_MB || unset GALAXY_MEMORY_MB
[ "${GALAXY_MEMORY_MB_PERSLOT--1}" -gt 0 ] 2>>memory_statement.log && export GALAXY_MEMORY_MB_PERSLOT || unset GALAXY_MEMORY_MB_PERSLOT
